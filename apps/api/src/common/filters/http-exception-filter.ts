import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ZodValidationException } from 'nestjs-zod';

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

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erro interno de servidor.';
    let errors: { field: string; message: string }[] = [];

    if (exception instanceof ZodValidationException) {
      statusCode = HttpStatus.BAD_REQUEST;
      message = 'Erro de validação.';
      errors = exception.getZodError().errors.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else {
        message = exceptionResponse.message || 'Erro na requisição.';
        errors = exceptionResponse.errors || [];
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorBody: ErrorResponse = {
      status: statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      errors,
    };

    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(exception);
    }

    response.status(statusCode).json(errorBody);
  }
}
