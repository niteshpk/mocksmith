import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.int.test.ts'],
    setupFiles: ['tests/test-setup.ts'],
    environment: 'node',
    globals: true,
    // Run tests in a single worker to avoid races with in-memory SQLite
    pool: 'forks',
    maxWorkers: 1,
    minWorkers: 1,
    sequence: { concurrent: false },
    coverage: {
      reporter: ['text', 'html'],
    },
  },
});
