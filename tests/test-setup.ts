// Ensure test env + in-memory DB *before* any app/db imports
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'silent';
process.env.DATABASE_URL = ':memory:';

import { afterAll } from 'vitest';

import { db } from '../src/db/sqlite';

// Close DB when the test process finishes
afterAll(() => {
  try {
    db.close();
  } catch {
    // ignore
  }
});
