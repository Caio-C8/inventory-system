import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';

export interface Response<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

@Injectable()
export class CustomResponse<T> implements NestInterceptor<T, Response<T>> {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const statusCode = response.statusCode;

        const decoratorMessage = this.reflector.get<string>(
          RESPONSE_MESSAGE_KEY,
          context.getHandler(),
        );

        const finalMessage =
          decoratorMessage || data?.message || 'Operação realizada com sucesso';

        return {
          status: statusCode,
          success: true,
          message: finalMessage,
          data: data?.results || data,
        };
      }),
    );
  }
}
