import js from '@eslint/js';
import globals from 'globals';
import typescript from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: { parser },
    plugins: { '@typescript-eslint': typescript },
    rules: {
      ...typescript.configs.recommended.rules
    }
  },
];
