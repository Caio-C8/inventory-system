import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  status: number;
  timestamp: string;
  path: string;
  message: string;
  errors: { field: string; message: string }[];
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const errorBody: ErrorResponse = {
      status: statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: 'Erro interno de servidor.',
      errors: [],
    };

    if (exceptionResponse) {
      if (typeof exceptionResponse === 'string') {
        errorBody.message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as any;

        if (resp.errors) {
          errorBody.errors = resp.errors;
          errorBody.message = resp.message || 'Erro de validação.';
        } else if (Array.isArray(resp.message)) {
          errorBody.message = 'Erro de validação.';
          errorBody.errors = resp.message.map((msg: string) => ({
            field: 'global',
            message: msg,
          }));
        } else if (resp.message) {
          errorBody.message = resp.message;
        }
      }
    } else if (exception instanceof Error) {
      errorBody.message = exception.message;
    }

    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(exception);
    }

    response.status(statusCode).json(errorBody);
  }
}
