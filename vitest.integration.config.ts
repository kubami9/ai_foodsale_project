import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    include: ['apps/api/test/database.integration.spec.ts'],
    testTimeout: 15_000,
    hookTimeout: 30_000,
    fileParallelism: false,
  },
});
