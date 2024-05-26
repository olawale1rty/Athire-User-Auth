import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const excetionResponse = exception.getResponse();

    const error =
      typeof response === 'string'
        ? { message: excetionResponse }
        : (excetionResponse as Record<string, unknown>);

    return response.status(status).json({
      statusCode: status,
      ...error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
