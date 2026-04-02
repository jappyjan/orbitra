import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deriveKey, generateSalt, toBase64, fromBase64 } from './crypto';
import { setKey } from './keyHolder';

const SALT_STORAGE_KEY = 'orbitra-key-salt';
const KEY_SECURE_KEY = 'orbitra-encryption-key';

// Web fallback: sessionStorage (key cleared when tab closes)
const WEB_SESSION_KEY = 'orbitra-session-key';

async function getSecureStore() {
  return await import('expo-secure-store');
}

/**
 * Check if a passphrase has been set up (salt exists = encryption is configured).
 */
export async function isSetup(): Promise<boolean> {
  const salt = await AsyncStorage.getItem(SALT_STORAGE_KEY);
  return salt !== null;
}

/**
 * First-time setup: derive key from passphrase, store key securely, store salt.
 */
export async function setup(passphrase: string): Promise<Uint8Array> {
  const salt = generateSalt();
  const rawKey = await deriveKey(passphrase, salt);

  // Store salt in AsyncStorage (not secret)
  await AsyncStorage.setItem(SALT_STORAGE_KEY, toBase64(salt));

  // Store derived key in secure storage
  if (Platform.OS === 'web') {
    sessionStorage.setItem(WEB_SESSION_KEY, toBase64(rawKey));
  } else {
    const SecureStore = await getSecureStore();
    await SecureStore.setItemAsync(KEY_SECURE_KEY, toBase64(rawKey));
  }

  setKey(rawKey);
  return rawKey;
}

/**
 * Unlock with passphrase: re-derive key from passphrase + stored salt, verify it works.
 */
export async function unlockWithPassphrase(passphrase: string): Promise<Uint8Array> {
  const saltBase64 = await AsyncStorage.getItem(SALT_STORAGE_KEY);
  if (!saltBase64) throw new Error('No encryption salt found. App not set up.');

  const salt = fromBase64(saltBase64);
  const rawKey = await deriveKey(passphrase, salt);

  // Store derived key for future biometric unlocks
  if (Platform.OS === 'web') {
    sessionStorage.setItem(WEB_SESSION_KEY, toBase64(rawKey));
  } else {
    const SecureStore = await getSecureStore();
    await SecureStore.setItemAsync(KEY_SECURE_KEY, toBase64(rawKey));
  }

  setKey(rawKey);
  return rawKey;
}

/**
 * Unlock with stored key (biometric or auto-unlock).
 * Returns the raw key bytes, or null if no stored key exists.
 */
export async function unlockWithStoredKey(): Promise<Uint8Array | null> {
  let keyBase64: string | null = null;

  if (Platform.OS === 'web') {
    keyBase64 = sessionStorage.getItem(WEB_SESSION_KEY);
  } else {
    const SecureStore = await getSecureStore();
    keyBase64 = await SecureStore.getItemAsync(KEY_SECURE_KEY);
  }

  if (!keyBase64) return null;

  const rawKey = fromBase64(keyBase64);
  setKey(rawKey);
  return rawKey;
}

/**
 * Lock the app: clear the in-memory key.
 */
export function lock(): void {
  setKey(null);
}

/**
 * Clear all encryption data (factory reset).
 */
export async function clearAll(): Promise<void> {
  setKey(null);
  await AsyncStorage.removeItem(SALT_STORAGE_KEY);

  if (Platform.OS === 'web') {
    sessionStorage.removeItem(WEB_SESSION_KEY);
  } else {
    const SecureStore = await getSecureStore();
    await SecureStore.deleteItemAsync(KEY_SECURE_KEY);
  }
}
