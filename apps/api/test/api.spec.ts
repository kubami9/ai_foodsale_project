import 'reflect-metadata';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/app.js';
import { APP_CONFIG } from '../src/config/env.js';
import { DatabaseService } from '../src/database/database.service.js';
import { CATALOG_REPOSITORY } from '../src/catalog/catalog.repository.js';

let app: INestApplication;
let baseUrl: string;
beforeAll(async () => {
  const module = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(APP_CONFIG)
    .useValue({ port: 3000, databaseUrl: 'postgresql://localhost/unused' })
    .overrideProvider(DatabaseService)
    .useValue({ ready: async () => true })
    .overrideProvider(CATALOG_REPOSITORY)
    .useValue({
      list: async () => ({ items: [], total: 0, page: 1, pageSize: 12 }),
      findById: async () => null,
    })
    .compile();
  app = module.createNestApplication();
  configureApp(app);
  await app.listen(0, '127.0.0.1');
  baseUrl = await app.getUrl();
});
afterAll(async () => {
  await app?.close();
});

describe('HTTP contract', () => {
  it('serves liveness without connecting to PostgreSQL', async () => {
    const response = await fetch(`${baseUrl}/api/health`);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, data: { status: 'ok' } });
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
  });
  it('returns a bounded catalog response', async () => {
    const response = await fetch(`${baseUrl}/api/products`);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      ok: true,
      data: { items: [], total: 0, page: 1, pageSize: 12 },
    });
  });
  it('rejects invalid filters with a stable error envelope', async () => {
    const response = await fetch(`${baseUrl}/api/products?page=-1`);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      ok: false,
      error: { code: 'VALIDATION_ERROR', message: 'Nieprawidłowe parametry zapytania.' },
    });
  });
  it('rejects malformed product identifiers', async () => {
    const response = await fetch(`${baseUrl}/api/products/not-a-uuid`);
    expect(response.status).toBe(400);
  });
  it('reports a missing product with 404', async () => {
    const response = await fetch(`${baseUrl}/api/products/00000000-0000-4000-8000-000000000001`);
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      ok: false,
      error: { code: 'PRODUCT_NOT_FOUND', message: 'Nie znaleziono produktu.' },
    });
  });
  it('does not expose write endpoints before authentication is implemented', async () => {
    expect((await fetch(`${baseUrl}/api/products`, { method: 'POST' })).status).toBe(404);
  });
});

describe('database outage responses', () => {
  let unavailableApp: INestApplication;
  let unavailableUrl: string;
  beforeAll(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(APP_CONFIG)
      .useValue({
        port: 3000,
        databaseUrl: 'postgresql://private:secret@127.0.0.1:1/foodsale_test',
      })
      .compile();
    unavailableApp = module.createNestApplication();
    configureApp(unavailableApp);
    await unavailableApp.listen(0, '127.0.0.1');
    unavailableUrl = await unavailableApp.getUrl();
  });
  afterAll(async () => {
    await unavailableApp?.close();
  });
  it('keeps liveness available during a database outage', async () => {
    expect((await fetch(`${unavailableUrl}/api/health`)).status).toBe(200);
  });
  it('reports an unavailable database without leaking connection details', async () => {
    const response = await fetch(`${unavailableUrl}/api/health/ready`);
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      ok: false,
      error: { code: 'DATABASE_UNAVAILABLE', message: 'Baza danych jest chwilowo niedostępna.' },
    });
  });
  it('reports catalog unavailability with a safe message', async () => {
    const response = await fetch(`${unavailableUrl}/api/products`);
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      ok: false,
      error: {
        code: 'DATABASE_UNAVAILABLE',
        message: 'Katalog jest chwilowo niedostępny. Spróbuj ponownie.',
      },
    });
  });
});
