import { Module } from '@nestjs/common';
import { APP_CONFIG, readConfig } from './config/env.js';
import { DatabaseService } from './database/database.service.js';
import { PostgresCatalogRepository } from './database/catalog.postgres.repository.js';
import { CATALOG_REPOSITORY } from './catalog/catalog.repository.js';
import { CatalogService } from './catalog/catalog.service.js';
import { CatalogController } from './catalog/catalog.controller.js';
import { HealthController } from './health/health.controller.js';
@Module({
  controllers: [CatalogController, HealthController],
  providers: [
    { provide: APP_CONFIG, useFactory: () => readConfig() },
    DatabaseService,
    { provide: CATALOG_REPOSITORY, useClass: PostgresCatalogRepository },
    CatalogService,
  ],
})
export class AppModule {}
