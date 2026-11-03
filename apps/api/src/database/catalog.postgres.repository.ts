import { Inject, Injectable } from '@nestjs/common';
import { catalogPageSchema, productSchema } from '@foodsale/contracts';
import type { CatalogQuery, CatalogPage, Product } from '@foodsale/contracts';
import type { CatalogRepository } from '../catalog/catalog.repository.js';
import { DatabaseService } from './database.service.js';
import { AppError } from '../http/app-error.js';

const productColumns = `p.id, p.name, p.description, p.category,
  p.price_grosze AS "priceGrosze", p.currency, p.unit, p.stock_quantity > 0 AS available,
  json_build_object('id', s.id, 'name', s.name, 'city', s.city, 'description', s.description) AS seller`;
const filterClause = `FROM products p JOIN sellers s ON s.id = p.seller_id
  WHERE ($1 = '' OR position(lower($1) in lower(p.name || ' ' || p.description || ' ' || s.name || ' ' || s.city)) > 0)
  AND ($2::text IS NULL OR p.category = $2)
  AND ($3::boolean IS NULL OR (p.stock_quantity > 0) = $3)`;

@Injectable()
export class PostgresCatalogRepository implements CatalogRepository {
  constructor(@Inject(DatabaseService) private readonly database: DatabaseService) {}
  async list(query: CatalogQuery): Promise<CatalogPage> {
    const filters = [query.query, query.category ?? null, query.available ?? null];
    try {
      const items = await this.database.pool.query(
        `SELECT ${productColumns} ${filterClause}
        ORDER BY p.name COLLATE "C", p.id LIMIT $4 OFFSET $5`,
        [...filters, query.pageSize, (query.page - 1) * query.pageSize],
      );
      const count = await this.database.pool.query<{ total: number }>(
        `SELECT count(*)::integer AS total ${filterClause}`,
        filters,
      );
      return catalogPageSchema.parse({
        items: items.rows,
        total: count.rows[0]?.total ?? 0,
        page: query.page,
        pageSize: query.pageSize,
      });
    } catch {
      throw this.unavailable();
    }
  }
  async findById(id: string): Promise<Product | null> {
    try {
      const result = await this.database.pool.query(
        `SELECT ${productColumns}
        FROM products p JOIN sellers s ON s.id = p.seller_id WHERE p.id = $1`,
        [id],
      );
      return result.rows[0] ? productSchema.parse(result.rows[0]) : null;
    } catch {
      throw this.unavailable();
    }
  }
  private unavailable(): AppError {
    return new AppError(
      503,
      'DATABASE_UNAVAILABLE',
      'Katalog jest chwilowo niedostępny. Spróbuj ponownie.',
    );
  }
}
