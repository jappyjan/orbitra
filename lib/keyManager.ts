// This file is native-only (iOS/Android). Metro resolves keyManager.web.ts for web.
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { deriveKey, generateSalt, toBase64, fromBase64 } from './crypto';
import { setKey } from './keyHolder';

const SALT_STORAGE_KEY = 'orbitra-key-salt';
const KEY_SECURE_KEY = 'orbitra-encryption-key';

export async function isSetup(): Promise<boolean> {
  const salt = await AsyncStorage.getItem(SALT_STORAGE_KEY);
  return salt !== null;
}

export async function setup(passphrase: string): Promise<Uint8Array> {
  const salt = generateSalt();
  const rawKey = await deriveKey(passphrase, salt);

  await AsyncStorage.setItem(SALT_STORAGE_KEY, toBase64(salt));
  await SecureStore.setItemAsync(KEY_SECURE_KEY, toBase64(rawKey));

  setKey(rawKey);
  return rawKey;
}

export async function unlockWithPassphrase(passphrase: string): Promise<Uint8Array> {
  const saltBase64 = await AsyncStorage.getItem(SALT_STORAGE_KEY);
  if (!saltBase64) throw new Error('No encryption salt found. App not set up.');

  const salt = fromBase64(saltBase64);
  const rawKey = await deriveKey(passphrase, salt);

  await SecureStore.setItemAsync(KEY_SECURE_KEY, toBase64(rawKey));

  setKey(rawKey);
  return rawKey;
}

export async function unlockWithStoredKey(): Promise<Uint8Array | null> {
  const keyBase64 = await SecureStore.getItemAsync(KEY_SECURE_KEY);
  if (!keyBase64) return null;

  const rawKey = fromBase64(keyBase64);
  setKey(rawKey);
  return rawKey;
}

export function lock(): void {
  setKey(null);
}

export async function clearAll(): Promise<void> {
  setKey(null);
  await AsyncStorage.removeItem(SALT_STORAGE_KEY);
  await SecureStore.deleteItemAsync(KEY_SECURE_KEY);
}
