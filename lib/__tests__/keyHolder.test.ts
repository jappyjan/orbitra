import { setKey, getKey } from '../keyHolder';

describe('keyHolder', () => {
  afterEach(() => {
    // Clean up after each test
    setKey(null);
  });

  it('starts with null key', () => {
    expect(getKey()).toBeNull();
  });

  it('sets and gets a key', () => {
    const key = new Uint8Array([1, 2, 3, 4, 5]);
    setKey(key);
    expect(getKey()).toBe(key);
  });

  it('clears the key when set to null', () => {
    const key = new Uint8Array([10, 20, 30]);
    setKey(key);
    expect(getKey()).not.toBeNull();

    setKey(null);
    expect(getKey()).toBeNull();
  });

  it('overwrites previous key with new key', () => {
    const key1 = new Uint8Array([1, 2, 3]);
    const key2 = new Uint8Array([4, 5, 6]);

    setKey(key1);
    expect(getKey()).toBe(key1);

    setKey(key2);
    expect(getKey()).toBe(key2);
    expect(getKey()).not.toBe(key1);
  });

  it('returns the exact same reference', () => {
    const key = new Uint8Array(32);
    setKey(key);
    const retrieved = getKey();
    expect(retrieved).toBe(key);
    // Mutating the returned reference mutates the stored key (same ref)
    if (retrieved) {
      retrieved[0] = 42;
      expect(getKey()![0]).toBe(42);
    }
  });
});
