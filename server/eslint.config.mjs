import tsEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended, // config mặc định JS
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      '@typescript-eslint': tsEslint,
    },
    rules: {
      // Tắt mấy rule hay gây phiền khi dev
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',

      // Dọn unused imports/vars
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],

      // Async / Promise safety
      'require-await': 'off',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/no-floating-promises': 'error',

      // Prettier integration
      'prettier/prettier': 'error',
    },
  },
];
