import { describe, expect, it } from 'vitest';
import { catalogQuerySchema, productSchema } from './index.js';

describe('catalog query contract', () => {
  it('uses a bounded first page by default', () => {
    expect(catalogQuerySchema.parse({})).toEqual({ query: '', page: 1, pageSize: 12 });
  });
  it('trims search text and parses query-string numbers and booleans', () => {
    expect(
      catalogQuerySchema.parse({
        query: '  ser  ',
        category: 'dairy',
        available: 'false',
        page: '2',
        pageSize: '4',
      }),
    ).toEqual({ query: 'ser', category: 'dairy', available: false, page: 2, pageSize: 4 });
  });
  it('rejects unsupported categories', () => {
    expect(catalogQuerySchema.safeParse({ category: 'other' }).success).toBe(false);
  });
  it('rejects oversized pages', () => {
    expect(catalogQuerySchema.safeParse({ pageSize: '101' }).success).toBe(false);
  });
  it('rejects invalid boolean values instead of coercing them to true', () => {
    expect(catalogQuerySchema.safeParse({ available: 'maybe' }).success).toBe(false);
  });
  it('rejects unexpected filter keys', () => {
    expect(catalogQuerySchema.safeParse({ sort: 'DROP TABLE products' }).success).toBe(false);
  });
});

describe('product contract', () => {
  it('rejects fractional amounts because prices are integer grosze', () => {
    expect(productSchema.shape.priceGrosze.safeParse(12.5).success).toBe(false);
  });
  it('rejects negative prices', () => {
    expect(productSchema.shape.priceGrosze.safeParse(-1).success).toBe(false);
  });
});
