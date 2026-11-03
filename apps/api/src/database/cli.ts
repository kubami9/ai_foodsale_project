import { Pool } from 'pg';
import { readConfig } from '../config/env.js';
import { migrate } from './migrate.js';
import { assertDemoDatabase, seedDemo } from './seed.js';

async function main(): Promise<void> {
  const command = process.argv[2];
  if (command !== 'migrate' && command !== 'seed') throw new Error('Usage: cli.ts migrate|seed');
  const { databaseUrl } = readConfig();
  if (command === 'seed')
    assertDemoDatabase(databaseUrl, process.env['ALLOW_DEMO_SEED'] === 'true');
  const pool = new Pool({
    connectionString: databaseUrl,
    connectionTimeoutMillis: 5_000,
    statement_timeout: 30_000,
  });
  try {
    if (command === 'migrate') await migrate(pool);
    else await seedDemo(pool);
    console.info(`Database ${command} completed.`);
  } finally {
    await pool.end();
  }
}
main().catch(() => {
  console.error(
    'Database command failed. Check the command, environment, database availability and migration integrity.',
  );
  process.exitCode = 1;
});
