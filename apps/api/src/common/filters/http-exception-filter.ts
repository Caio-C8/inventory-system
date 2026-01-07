import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
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

    let message = 'Erro interno de servidor';

    if (exceptionResponse) {
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message =
          (exceptionResponse as any).message ||
          (exceptionResponse as any).console.error;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorBody = {
      status: statusCode,
      success: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    };

    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      console.log(exception);
    }

    response.status(statusCode).json(errorBody);
    // {
    //     "statusCode": 400,
    //     "success": false,
    //     "timestamp": "2025-12-17T10:00:00.000Z",
    //     "path": "/products",
    //     "message": [
    //         "price must be a positive number",
    //         "sku should not be empty"
    //     ]
    // }
  }
}
