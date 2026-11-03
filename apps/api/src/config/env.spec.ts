import { describe, expect, it } from 'vitest';
import { readConfig } from './env.js';

describe('environment configuration', () => {
  it('requires an explicit PostgreSQL connection', () => {
    expect(() => readConfig({})).toThrow('Invalid environment configuration');
  });
  it('rejects non-PostgreSQL URLs without leaking a connection string', () => {
    expect(() => readConfig({ DATABASE_URL: 'https://private:secret@example.com/db' })).toThrow(
      'Invalid environment configuration: DATABASE_URL',
    );
  });
  it('accepts a local database and defaults the HTTP port', () => {
    expect(readConfig({ DATABASE_URL: 'postgresql://localhost/foodsale_dev' }).port).toBe(3000);
  });
  it('rejects an invalid port', () => {
    expect(() =>
      readConfig({ DATABASE_URL: 'postgresql://localhost/foodsale_dev', PORT: '99999' }),
    ).toThrow('Invalid environment configuration: PORT');
  });
});
