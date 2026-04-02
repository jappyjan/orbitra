import { Platform } from 'react-native';

const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32; // 256 bits
const PBKDF2_ITERATIONS = 600_000;

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function fromBase64(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// ── Web Crypto API implementation ──

async function deriveKeyWeb(passphrase: string, salt: Uint8Array): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: salt.buffer as ArrayBuffer, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    KEY_LENGTH * 8
  );
  return new Uint8Array(bits);
}

async function encryptWeb(plaintext: string, rawKey: Uint8Array): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await crypto.subtle.importKey('raw', rawKey.buffer as ArrayBuffer, 'AES-GCM', false, ['encrypt']);
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
  // Combine: iv || ciphertext (Web Crypto appends auth tag automatically)
  const combined = new Uint8Array(IV_LENGTH + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), IV_LENGTH);
  return toBase64(combined);
}

async function decryptWeb(encoded: string, rawKey: Uint8Array): Promise<string> {
  const combined = fromBase64(encoded);
  const iv = combined.slice(0, IV_LENGTH);
  const ciphertext = combined.slice(IV_LENGTH);
  const key = await crypto.subtle.importKey('raw', rawKey.buffer as ArrayBuffer, 'AES-GCM', false, ['decrypt']);
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  return new TextDecoder().decode(decrypted);
}

function generateSaltWeb(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

// ── Native (react-native-quick-crypto) implementation ──
// Lazy require() is intentional: the native module must not load on web.
/* eslint-disable @typescript-eslint/no-require-imports */

async function deriveKeyNative(passphrase: string, salt: Uint8Array): Promise<Uint8Array> {
  const QuickCrypto = require('react-native-quick-crypto');
  return new Promise<Uint8Array>((resolve, reject) => {
    QuickCrypto.pbkdf2(
      passphrase,
      Buffer.from(salt),
      PBKDF2_ITERATIONS,
      KEY_LENGTH,
      'sha256',
      (err: Error | null, derivedKey: Buffer) => {
        if (err) reject(err);
        else resolve(new Uint8Array(derivedKey));
      }
    );
  });
}

async function encryptNative(plaintext: string, rawKey: Uint8Array): Promise<string> {
  const QuickCrypto = require('react-native-quick-crypto');
  const iv = new Uint8Array(QuickCrypto.randomBytes(IV_LENGTH));
  const cipher = QuickCrypto.createCipheriv('aes-256-gcm', Buffer.from(rawKey), Buffer.from(iv));
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  // Combine: iv || ciphertext || authTag
  const combined = new Uint8Array(IV_LENGTH + encrypted.length + AUTH_TAG_LENGTH);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), IV_LENGTH);
  combined.set(new Uint8Array(authTag), IV_LENGTH + encrypted.length);
  return toBase64(combined);
}

async function decryptNative(encoded: string, rawKey: Uint8Array): Promise<string> {
  const QuickCrypto = require('react-native-quick-crypto');
  const combined = fromBase64(encoded);
  const iv = combined.slice(0, IV_LENGTH);
  const ciphertext = combined.slice(IV_LENGTH, combined.length - AUTH_TAG_LENGTH);
  const authTag = combined.slice(combined.length - AUTH_TAG_LENGTH);

  const decipher = QuickCrypto.createDecipheriv('aes-256-gcm', Buffer.from(rawKey), Buffer.from(iv));
  decipher.setAuthTag(Buffer.from(authTag));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(ciphertext)),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
}

function generateSaltNative(): Uint8Array {
  const QuickCrypto = require('react-native-quick-crypto');
  return new Uint8Array(QuickCrypto.randomBytes(SALT_LENGTH));
}

/* eslint-enable @typescript-eslint/no-require-imports */

// ── Exported API (platform-branching) ──

const isWeb = Platform.OS === 'web';

export async function deriveKey(passphrase: string, salt: Uint8Array): Promise<Uint8Array> {
  return isWeb ? deriveKeyWeb(passphrase, salt) : deriveKeyNative(passphrase, salt);
}

export async function encrypt(plaintext: string, rawKey: Uint8Array): Promise<string> {
  return isWeb ? encryptWeb(plaintext, rawKey) : encryptNative(plaintext, rawKey);
}

export async function decrypt(encoded: string, rawKey: Uint8Array): Promise<string> {
  return isWeb ? decryptWeb(encoded, rawKey) : decryptNative(encoded, rawKey);
}

export function generateSalt(): Uint8Array {
  return isWeb ? generateSaltWeb() : generateSaltNative();
}

export { toBase64, fromBase64 };
