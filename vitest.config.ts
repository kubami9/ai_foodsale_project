import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    include: [
      'packages/*/src/**/*.spec.ts',
      'apps/api/src/**/*.spec.ts',
      'apps/api/test/api.spec.ts',
    ],
    testTimeout: 10_000,
    hookTimeout: 15_000,
  },
});
