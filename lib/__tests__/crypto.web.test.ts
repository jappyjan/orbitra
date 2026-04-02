/**
 * Tests for the web crypto module.
 * These test the toBase64/fromBase64 helpers and the encrypt/decrypt round-trip.
 *
 * Note: We use the Node.js crypto.subtle (available since Node 15+)
 * which is compatible with the Web Crypto API used in crypto.web.ts.
 */

// Polyfill global crypto for test environment if needed
if (typeof globalThis.crypto === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { webcrypto } = require('crypto');
  Object.defineProperty(globalThis, 'crypto', { value: webcrypto });
}

// We need to import the .web.ts file explicitly since Jest won't resolve platform extensions
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cryptoWeb = require('../crypto.web');

const { toBase64, fromBase64, encrypt, decrypt, generateSalt, deriveKey } = cryptoWeb;

describe('crypto.web', () => {
  describe('toBase64 / fromBase64', () => {
    it('round-trips a simple byte array', () => {
      const original = new Uint8Array([0, 1, 2, 3, 255]);
      const encoded = toBase64(original);
      const decoded = fromBase64(encoded);
      expect(decoded).toEqual(original);
    });

    it('round-trips an empty array', () => {
      const original = new Uint8Array([]);
      const encoded = toBase64(original);
      const decoded = fromBase64(encoded);
      expect(decoded).toEqual(original);
    });

    it('produces a valid base64 string', () => {
      const bytes = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
      const encoded = toBase64(bytes);
      expect(encoded).toBe(btoa('Hello'));
    });

    it('round-trips a 32-byte key-sized array', () => {
      const original = new Uint8Array(32);
      for (let i = 0; i < 32; i++) original[i] = i;
      const encoded = toBase64(original);
      const decoded = fromBase64(encoded);
      expect(decoded).toEqual(original);
    });
  });

  describe('generateSalt', () => {
    it('returns a Uint8Array of 16 bytes', () => {
      const salt = generateSalt();
      expect(salt).toBeInstanceOf(Uint8Array);
      expect(salt.length).toBe(16);
    });

    it('returns different values each time', () => {
      const salt1 = generateSalt();
      const salt2 = generateSalt();
      // Extremely unlikely to be equal
      expect(toBase64(salt1)).not.toBe(toBase64(salt2));
    });
  });

  describe('deriveKey', () => {
    it('derives a 32-byte key from passphrase and salt', async () => {
      const salt = new Uint8Array(16);
      // Use fewer iterations for faster testing isn't possible since iterations are hardcoded.
      // This test may be slow (~1-2s) due to 600k PBKDF2 iterations.
      const key = await deriveKey('test-passphrase', salt);
      expect(key).toBeInstanceOf(Uint8Array);
      expect(key.length).toBe(32);
    }, 30000);

    it('produces same key for same passphrase and salt', async () => {
      const salt = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
      const key1 = await deriveKey('same-pass', salt);
      const key2 = await deriveKey('same-pass', salt);
      expect(toBase64(key1)).toBe(toBase64(key2));
    }, 30000);

    it('produces different keys for different passphrases', async () => {
      const salt = new Uint8Array(16);
      const key1 = await deriveKey('pass-one', salt);
      const key2 = await deriveKey('pass-two', salt);
      expect(toBase64(key1)).not.toBe(toBase64(key2));
    }, 30000);

    it('produces different keys for different salts', async () => {
      const salt1 = new Uint8Array(16).fill(0);
      const salt2 = new Uint8Array(16).fill(1);
      const key1 = await deriveKey('same-pass', salt1);
      const key2 = await deriveKey('same-pass', salt2);
      expect(toBase64(key1)).not.toBe(toBase64(key2));
    }, 30000);
  });

  describe('encrypt / decrypt', () => {
    let testKey: Uint8Array;

    beforeAll(async () => {
      // Derive a real key once for all encrypt/decrypt tests
      const salt = new Uint8Array(16).fill(42);
      testKey = await deriveKey('test-encryption-key', salt);
    }, 30000);

    it('round-trips a simple string', async () => {
      const plaintext = 'Hello, World!';
      const ciphertext = await encrypt(plaintext, testKey);
      const decrypted = await decrypt(ciphertext, testKey);
      expect(decrypted).toBe(plaintext);
    });

    it('round-trips an empty string', async () => {
      const plaintext = '';
      const ciphertext = await encrypt(plaintext, testKey);
      const decrypted = await decrypt(ciphertext, testKey);
      expect(decrypted).toBe(plaintext);
    });

    it('round-trips a JSON string', async () => {
      const data = JSON.stringify({ people: { id1: { name: 'Alice' } } });
      const ciphertext = await encrypt(data, testKey);
      const decrypted = await decrypt(ciphertext, testKey);
      expect(JSON.parse(decrypted)).toEqual(JSON.parse(data));
    });

    it('round-trips unicode text', async () => {
      const plaintext = 'Hello 🌍 Welt! Привет мир 你好世界';
      const ciphertext = await encrypt(plaintext, testKey);
      const decrypted = await decrypt(ciphertext, testKey);
      expect(decrypted).toBe(plaintext);
    });

    it('produces different ciphertext for same plaintext (random IV)', async () => {
      const plaintext = 'same text';
      const ct1 = await encrypt(plaintext, testKey);
      const ct2 = await encrypt(plaintext, testKey);
      expect(ct1).not.toBe(ct2);
    });

    it('ciphertext is a base64 string', async () => {
      const ciphertext = await encrypt('test', testKey);
      expect(typeof ciphertext).toBe('string');
      // Base64 characters only
      expect(ciphertext).toMatch(/^[A-Za-z0-9+/=]+$/);
    });

    it('fails to decrypt with wrong key', async () => {
      const wrongKey = new Uint8Array(32).fill(0);
      const ciphertext = await encrypt('secret', testKey);
      await expect(decrypt(ciphertext, wrongKey)).rejects.toThrow();
    });

    it('round-trips a large string', async () => {
      const plaintext = 'x'.repeat(10000);
      const ciphertext = await encrypt(plaintext, testKey);
      const decrypted = await decrypt(ciphertext, testKey);
      expect(decrypted).toBe(plaintext);
    });
  });
});
