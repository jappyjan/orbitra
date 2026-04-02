/**
 * Module-level singleton for the encryption key.
 * The key lives in memory only while the app is unlocked.
 * Accessible outside the React tree (used by the Zustand storage adapter).
 */

let _key: Uint8Array | null = null;

export function setKey(key: Uint8Array | null): void {
  _key = key;
}

export function getKey(): Uint8Array | null {
  return _key;
}
