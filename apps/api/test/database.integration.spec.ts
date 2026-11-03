import 'reflect-metadata';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Pool } from 'pg';
import { migrate } from '../src/database/migrate.js';
import { seedDemo } from '../src/database/seed.js';
import { DatabaseService } from '../src/database/database.service.js';
import { PostgresCatalogRepository } from '../src/database/catalog.postgres.repository.js';
import { catalogQuerySchema } from '@foodsale/contracts';

const databaseUrl = process.env['TEST_DATABASE_URL'];
if (!databaseUrl || !new URL(databaseUrl).pathname.endsWith('_test')) {
  throw new Error(
    'Set TEST_DATABASE_URL to a dedicated database ending in _test; copy .env.test.example to .env.test.',
  );
}
const pool = new Pool({ connectionString: databaseUrl, connectionTimeoutMillis: 3_000 });
const database = new DatabaseService({ databaseUrl, port: 3000 });
const repository = new PostgresCatalogRepository(database);
beforeAll(async () => {
  await migrate(pool);
  await migrate(pool);
  await seedDemo(pool);
  await seedDemo(pool);
});
afterAll(async () => {
  await pool.end();
  await database.onApplicationShutdown();
});

describe('PostgreSQL catalog', () => {
  it('applies migrations and seed twice without duplicating demo data', async () => {
    const result = await repository.list(catalogQuerySchema.parse({}));
    expect(result.total).toBe(6);
    expect(result.items).toHaveLength(6);
  });
  it('filters by seller location and category', async () => {
    const result = await repository.list(
      catalogQuerySchema.parse({ query: 'Kazimierz', category: 'dairy' }),
    );
    expect(result.total).toBe(2);
    expect(result.items[0]?.seller.name).toBe('Zagroda pod Lipami');
  });
  it('filters sold-out products', async () => {
    const result = await repository.list(catalogQuerySchema.parse({ available: 'false' }));
    expect(result.items.map((item) => item.name)).toEqual(['Pierogi z pieczonymi warzywami']);
  });
  it('returns total count even beyond the last page', async () => {
    const result = await repository.list(catalogQuerySchema.parse({ page: '10', pageSize: '2' }));
    expect(result.items).toEqual([]);
    expect(result.total).toBe(6);
  });
  it('paginates without repeating products', async () => {
    const first = await repository.list(catalogQuerySchema.parse({ pageSize: '2' }));
    const second = await repository.list(catalogQuerySchema.parse({ page: '2', pageSize: '2' }));
    expect(first.items).toHaveLength(2);
    expect(second.items).toHaveLength(2);
    expect(new Set([...first.items, ...second.items].map((item) => item.id)).size).toBe(4);
  });
  it('finds product details and represents money as integer grosze', async () => {
    const product = await repository.findById('20000000-0000-4000-8000-000000000001');
    expect(product?.priceGrosze).toBe(2400);
    expect(product?.seller.city).toBe('Kazimierz Dolny');
  });
  it('treats SQL injection attempts as literal search text', async () => {
    const result = await repository.list(catalogQuerySchema.parse({ query: "' OR 1=1 --" }));
    expect(result.total).toBe(0);
    expect((await pool.query('SELECT count(*)::integer AS total FROM products')).rows[0]).toEqual({
      total: 6,
    });
  });
  it('returns null for a missing UUID', async () => {
    expect(await repository.findById('20000000-0000-4000-8000-999999999999')).toBeNull();
  });
});
