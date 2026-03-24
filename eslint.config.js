import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'
import prettier from 'eslint-config-prettier'

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'public/**',
      '.eslintrc.js',
      'config/**',
      'postcss.config.cjs',
      'tailwind.config.js',
    ],
  },
  js.configs.recommended,
  // TypeScript rules for .ts files only
  {
    files: ['**/*.ts'],
    extends: tseslint.configs.recommended,
  },
  // Vue files: vue-eslint-parser as main parser + TypeScript as sub-parser
  {
    files: ['**/*.vue'],
    plugins: {
      vue: pluginVue,
      '@typescript-eslint': tseslint.plugin,
    },
    processor: pluginVue.processors['.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
      },
    },
    rules: {
      ...pluginVue.configs['flat/essential'].reduce((acc, c) => ({ ...acc, ...(c.rules ?? {}) }), {}),
      ...tseslint.configs.recommended.reduce((acc, c) => ({ ...acc, ...(c.rules ?? {}) }), {}),
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  // TypeScript unused vars rule for .ts files
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  prettier,
)
