/* global jest */
// Mock AsyncStorage for all tests
jest.mock('@react-native-async-storage/async-storage', () => {
  const store = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(async (key) => store[key] ?? null),
      setItem: jest.fn(async (key, value) => {
        store[key] = value;
      }),
      removeItem: jest.fn(async (key) => {
        delete store[key];
      }),
      clear: jest.fn(async () => {
        Object.keys(store).forEach((key) => delete store[key]);
      }),
      getAllKeys: jest.fn(async () => Object.keys(store)),
      multiGet: jest.fn(async (keys) => keys.map((key) => [key, store[key] ?? null])),
      multiSet: jest.fn(async (pairs) => {
        pairs.forEach(([key, value]) => {
          store[key] = value;
        });
      }),
      multiRemove: jest.fn(async (keys) => {
        keys.forEach((key) => delete store[key]);
      }),
    },
  };
});
