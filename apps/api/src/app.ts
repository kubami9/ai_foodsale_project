import type { INestApplication } from '@nestjs/common';
import helmet from 'helmet';
import { ApiExceptionFilter } from './http/api-exception.filter.js';
export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix('api');
  app.use(helmet());
  app.useGlobalFilters(new ApiExceptionFilter());
  app.enableShutdownHooks();
}
