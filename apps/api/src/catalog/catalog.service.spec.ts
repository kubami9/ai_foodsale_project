import { describe, expect, it } from 'vitest';
import type { CatalogRepository } from './catalog.repository.js';
import { CatalogService } from './catalog.service.js';
import { AppError } from '../http/app-error.js';

const emptyRepository: CatalogRepository = {
  list: async () => ({ items: [], total: 0, page: 1, pageSize: 12 }),
  findById: async () => null,
};

describe('CatalogService', () => {
  it('returns an empty catalog without treating it as an error', async () => {
    const service = new CatalogService(emptyRepository);
    await expect(service.list({ query: '', page: 1, pageSize: 12 })).resolves.toEqual({
      items: [],
      total: 0,
      page: 1,
      pageSize: 12,
    });
  });
  it('reports a missing product as a domain error', async () => {
    const service = new CatalogService(emptyRepository);
    await expect(service.findById('00000000-0000-4000-8000-000000000001')).rejects.toEqual(
      new AppError(404, 'PRODUCT_NOT_FOUND', 'Nie znaleziono produktu.'),
    );
  });
});
