import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StateStorage } from 'zustand/middleware';
import { encrypt, decrypt } from './crypto';
import { getKey } from './keyHolder';

/**
 * A Zustand-compatible StateStorage adapter that encrypts data before
 * writing to AsyncStorage and decrypts on read.
 *
 * Uses the module-level key from keyHolder. The key must be set
 * (via AuthContext unlock flow) before any store hydration occurs.
 */
export const encryptedStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const raw = await AsyncStorage.getItem(name);
    if (!raw) return null;

    const key = getKey();
    if (!key) throw new Error('Encryption key not available');

    return decrypt(raw, key);
  },

  setItem: async (name: string, value: string): Promise<void> => {
    const key = getKey();
    if (!key) throw new Error('Encryption key not available');

    const encrypted = await encrypt(value, key);
    await AsyncStorage.setItem(name, encrypted);
  },

  removeItem: async (name: string): Promise<void> => {
    await AsyncStorage.removeItem(name);
  },
};
