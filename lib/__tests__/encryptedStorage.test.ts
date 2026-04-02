import { encryptedStorage } from '../encryptedStorage';
import * as keyHolder from '../keyHolder';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock the crypto module
jest.mock('../crypto', () => ({
  encrypt: jest.fn(async (plaintext: string, _key: Uint8Array) => `encrypted:${plaintext}`),
  decrypt: jest.fn(async (ciphertext: string, _key: Uint8Array) =>
    ciphertext.replace('encrypted:', '')
  ),
}));

// AsyncStorage is auto-mocked by jest-expo

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { encrypt, decrypt } = require('../crypto');

describe('encryptedStorage', () => {
  const testKey = new Uint8Array([1, 2, 3, 4, 5]);

  beforeEach(() => {
    jest.clearAllMocks();
    keyHolder.setKey(testKey);
  });

  afterEach(() => {
    keyHolder.setKey(null);
  });

  describe('getItem', () => {
    it('returns null when no data exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await encryptedStorage.getItem('test-key');
      expect(result).toBeNull();
    });

    it('decrypts stored data with the current key', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('encrypted:hello');

      const result = await encryptedStorage.getItem('test-key');
      expect(decrypt).toHaveBeenCalledWith('encrypted:hello', testKey);
      expect(result).toBe('hello');
    });

    it('throws when encryption key is not available', async () => {
      keyHolder.setKey(null);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('encrypted:data');

      await expect(encryptedStorage.getItem('test-key')).rejects.toThrow(
        'Encryption key not available'
      );
    });

    it('does not attempt decryption when item is null', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      await encryptedStorage.getItem('test-key');
      expect(decrypt).not.toHaveBeenCalled();
    });
  });

  describe('setItem', () => {
    it('encrypts and stores data', async () => {
      await encryptedStorage.setItem('test-key', 'my-data');

      expect(encrypt).toHaveBeenCalledWith('my-data', testKey);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('test-key', 'encrypted:my-data');
    });

    it('throws when encryption key is not available', async () => {
      keyHolder.setKey(null);

      await expect(encryptedStorage.setItem('test-key', 'data')).rejects.toThrow(
        'Encryption key not available'
      );
    });
  });

  describe('removeItem', () => {
    it('removes item from AsyncStorage', async () => {
      await encryptedStorage.removeItem('test-key');

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('test-key');
    });

    it('does not require encryption key', async () => {
      keyHolder.setKey(null);

      // Should not throw - removeItem doesn't need the key
      await encryptedStorage.removeItem('test-key');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('test-key');
    });
  });
});
