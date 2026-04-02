/**
 * Tests for the web key manager.
 * We mock the crypto module to avoid slow PBKDF2 derivation in tests.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as keyHolder from '../keyHolder';

// Mock the crypto module for fast tests
jest.mock('../crypto', () => {
  const mockKey = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]);
  return {
    deriveKey: jest.fn().mockResolvedValue(mockKey),
    generateSalt: jest.fn(() => new Uint8Array(16).fill(42)),
    toBase64: jest.fn((bytes: Uint8Array) => {
      let binary = '';
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      return btoa(binary);
    }),
    fromBase64: jest.fn((base64: string) => {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return bytes;
    }),
  };
});

// Mock sessionStorage
const mockSessionStorage: Record<string, string> = {};
Object.defineProperty(globalThis, 'sessionStorage', {
  value: {
    getItem: jest.fn((key: string) => mockSessionStorage[key] ?? null),
    setItem: jest.fn((key: string, value: string) => { mockSessionStorage[key] = value; }),
    removeItem: jest.fn((key: string) => { delete mockSessionStorage[key]; }),
  },
  writable: true,
});

// Import after mocks are set up - use require for .web.ts
// eslint-disable-next-line @typescript-eslint/no-require-imports
const keyManager = require('../keyManager.web');

describe('keyManager.web', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    keyHolder.setKey(null);
    // Clear mock session storage
    for (const key of Object.keys(mockSessionStorage)) {
      delete mockSessionStorage[key];
    }
  });

  describe('isSetup', () => {
    it('returns false when no salt is stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      expect(await keyManager.isSetup()).toBe(false);
    });

    it('returns true when salt exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('some-base64-salt');
      expect(await keyManager.isSetup()).toBe(true);
    });
  });

  describe('setup', () => {
    it('generates salt, derives key, and stores everything', async () => {
      const result = await keyManager.setup('my-passphrase');

      // Should store salt in AsyncStorage
      expect(AsyncStorage.setItem).toHaveBeenCalled();
      // Should store key in sessionStorage
      expect(sessionStorage.setItem).toHaveBeenCalled();
      // Should set key in keyHolder
      expect(keyHolder.getKey()).not.toBeNull();
      // Should return the derived key
      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.length).toBe(32);
    });
  });

  describe('unlockWithPassphrase', () => {
    it('derives key from passphrase and stored salt', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(btoa(String.fromCharCode(...new Uint8Array(16).fill(42))));

      const result = await keyManager.unlockWithPassphrase('my-passphrase');

      expect(result).toBeInstanceOf(Uint8Array);
      expect(keyHolder.getKey()).not.toBeNull();
      expect(sessionStorage.setItem).toHaveBeenCalled();
    });

    it('throws when no salt is found', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      await expect(keyManager.unlockWithPassphrase('my-passphrase')).rejects.toThrow(
        'No encryption salt found'
      );
    });
  });

  describe('unlockWithStoredKey', () => {
    it('returns key from sessionStorage when available', async () => {
      const keyBase64 = btoa(String.fromCharCode(...new Uint8Array(32).fill(7)));
      mockSessionStorage['orbitra-session-key'] = keyBase64;
      (sessionStorage.getItem as jest.Mock).mockReturnValue(keyBase64);

      const result = await keyManager.unlockWithStoredKey();

      expect(result).toBeInstanceOf(Uint8Array);
      expect(keyHolder.getKey()).not.toBeNull();
    });

    it('returns null when no stored key exists', async () => {
      (sessionStorage.getItem as jest.Mock).mockReturnValue(null);

      const result = await keyManager.unlockWithStoredKey();

      expect(result).toBeNull();
      expect(keyHolder.getKey()).toBeNull();
    });
  });

  describe('lock', () => {
    it('clears the in-memory key', () => {
      keyHolder.setKey(new Uint8Array(32));
      keyManager.lock();
      expect(keyHolder.getKey()).toBeNull();
    });
  });

  describe('clearAll', () => {
    it('clears key, salt, and session key', async () => {
      keyHolder.setKey(new Uint8Array(32));

      await keyManager.clearAll();

      expect(keyHolder.getKey()).toBeNull();
      expect(AsyncStorage.removeItem).toHaveBeenCalled();
      expect(sessionStorage.removeItem).toHaveBeenCalled();
    });
  });
});
