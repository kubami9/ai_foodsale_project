import { Pool } from 'pg';
import { migrate } from '../apps/api/src/database/migrate.js';
import { seedDemo } from '../apps/api/src/database/seed.js';
export default async function setup(): Promise<void> {
  const connectionString = process.env['TEST_DATABASE_URL'];
  if (!connectionString || !new URL(connectionString).pathname.endsWith('_test')) {
    throw new Error('E2E setup requires a dedicated _test database.');
  }
  const pool = new Pool({ connectionString, connectionTimeoutMillis: 3_000 });
  try {
    await migrate(pool);
    await seedDemo(pool);
  } finally {
    await pool.end();
  }
}
