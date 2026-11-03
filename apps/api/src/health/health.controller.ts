import { Controller, Get, Inject } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
@Controller('health')
export class HealthController {
  constructor(@Inject(DatabaseService) private readonly database: DatabaseService) {}
  @Get()
  health() {
    return { ok: true as const, data: { status: 'ok' } };
  }
  @Get('ready')
  async ready() {
    await this.database.ready();
    return { ok: true as const, data: { status: 'ready' } };
  }
}
