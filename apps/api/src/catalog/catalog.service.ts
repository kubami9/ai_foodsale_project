import { Inject, Injectable } from '@nestjs/common';
import type { CatalogQuery, Product } from '@foodsale/contracts';
import { CATALOG_REPOSITORY } from './catalog.repository.js';
import type { CatalogRepository } from './catalog.repository.js';
import { AppError } from '../http/app-error.js';
@Injectable()
export class CatalogService {
  constructor(@Inject(CATALOG_REPOSITORY) private readonly repository: CatalogRepository) {}
  list(query: CatalogQuery) {
    return this.repository.list(query);
  }
  async findById(id: string): Promise<Product> {
    const product = await this.repository.findById(id);
    if (!product) throw new AppError(404, 'PRODUCT_NOT_FOUND', 'Nie znaleziono produktu.');
    return product;
  }
}
