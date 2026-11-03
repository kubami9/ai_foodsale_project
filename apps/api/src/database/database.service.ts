import { Inject, Injectable, Logger } from '@nestjs/common';
import type { OnApplicationShutdown } from '@nestjs/common';
import { Pool } from 'pg';
import { APP_CONFIG } from '../config/env.js';
import type { AppConfig } from '../config/env.js';
import { AppError } from '../http/app-error.js';

@Injectable()
export class DatabaseService implements OnApplicationShutdown {
  readonly pool: Pool;
  constructor(@Inject(APP_CONFIG) config: AppConfig) {
    this.pool = new Pool({
      connectionString: config.databaseUrl,
      max: 10,
      connectionTimeoutMillis: 3_000,
      idleTimeoutMillis: 10_000,
      statement_timeout: 5_000,
    });
    this.pool.on('error', () => {
      Logger.warn(
        'Idle database connection failed; the next request will reconnect.',
        DatabaseService.name,
      );
    });
  }
  async ready(): Promise<boolean> {
    try {
      await this.pool.query('SELECT 1');
      return true;
    } catch {
      throw new AppError(503, 'DATABASE_UNAVAILABLE', 'Baza danych jest chwilowo niedostępna.');
    }
  }
  async onApplicationShutdown(): Promise<void> {
    await this.pool.end();
  }
}
