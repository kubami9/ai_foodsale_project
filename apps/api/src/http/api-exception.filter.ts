import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common';
import type { ExceptionFilter } from '@nestjs/common';
import { AppError } from './app-error.js';
interface HttpResponse {
  status(code: number): HttpResponse;
  json(body: unknown): void;
}
@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);
  catch(error: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<HttpResponse>();
    if (error instanceof AppError) {
      response
        .status(error.status)
        .json({ ok: false, error: { code: error.code, message: error.message } });
      return;
    }
    if (error instanceof HttpException) {
      response
        .status(error.getStatus())
        .json({ ok: false, error: { code: 'HTTP_ERROR', message: 'Nie można wykonać żądania.' } });
      return;
    }
    this.logger.error('Unexpected request failure');
    response
      .status(500)
      .json({ ok: false, error: { code: 'INTERNAL_ERROR', message: 'Wystąpił błąd serwera.' } });
  }
}
