import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { configureApp } from './app.js';
import { APP_CONFIG } from './config/env.js';
import type { AppConfig } from './config/env.js';
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  configureApp(app);
  await app.listen(app.get<AppConfig>(APP_CONFIG).port, '0.0.0.0');
}
bootstrap().catch(() => {
  Logger.error('Application startup failed; verify environment configuration.');
  process.exitCode = 1;
});
