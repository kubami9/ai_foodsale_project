import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { catalogQuerySchema, productIdSchema } from '@foodsale/contracts';
import { CatalogService } from './catalog.service.js';
import { AppError } from '../http/app-error.js';
@Controller('products')
export class CatalogController {
  constructor(@Inject(CatalogService) private readonly catalog: CatalogService) {}
  @Get()
  async list(@Query() query: unknown) {
    const result = catalogQuerySchema.safeParse(query);
    if (!result.success)
      throw new AppError(400, 'VALIDATION_ERROR', 'Nieprawidłowe parametry zapytania.');
    return { ok: true as const, data: await this.catalog.list(result.data) };
  }
  @Get(':id')
  async findById(@Param('id') id: string) {
    const result = productIdSchema.safeParse(id);
    if (!result.success)
      throw new AppError(400, 'VALIDATION_ERROR', 'Nieprawidłowy identyfikator produktu.');
    return { ok: true as const, data: await this.catalog.findById(result.data) };
  }
}
