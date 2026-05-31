import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default [
  {
    ignores: ['.next/**', 'node_modules/**', 'dist/**', 'coverage/**'],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    // @typescript-eslint v7 is incompatible with ESLint 9 for this rule.
    // Remove once @typescript-eslint is upgraded to v8+.
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
];
