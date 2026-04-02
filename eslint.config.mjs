import expoConfig from "eslint-config-expo/flat.js";

export default [
  ...expoConfig,
  {
    ignores: ["dist/", ".expo/", "node_modules/", "scripts/"],
  },
  {
    files: ["**/__tests__/**/*.{js,ts,jsx,tsx}"],
    languageOptions: {
      globals: {
        it: "readonly",
        expect: "readonly",
        describe: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        jest: "readonly",
      },
    },
  },
];
