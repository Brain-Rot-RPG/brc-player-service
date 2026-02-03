import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  {
    ignores: ["node_modules", "dist", "*.config.js"],
  },
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      globals: {
        process: "readonly",
        console: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "warn",
    },
  },
  {
    files: ["src/tests/**/*.ts"],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        beforeEach: "readonly",
        afterAll: "readonly",
        jest: "readonly",
        process: "readonly",
        console: "readonly",
      },
    },
  },
];
