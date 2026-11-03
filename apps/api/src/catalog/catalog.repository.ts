import type { CatalogPage, CatalogQuery, Product } from '@foodsale/contracts';
export const CATALOG_REPOSITORY = Symbol('CATALOG_REPOSITORY');
export interface CatalogRepository {
  list(query: CatalogQuery): Promise<CatalogPage>;
  findById(id: string): Promise<Product | null>;
}
