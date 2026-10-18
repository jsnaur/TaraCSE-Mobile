// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  expoConfig,
  prettierRecommended,
  {
    ignores: ['dist/*', '.expo/*', 'node_modules/*', '.claude/*'],
  },
  {
    files: ['jest.setup.js'],
    languageOptions: { globals: { jest: 'readonly' } },
  },
  {
    rules: {
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
    },
  },
]);
