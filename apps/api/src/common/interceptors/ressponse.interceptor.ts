import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

@Injectable()
export class CustomResponse<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const statusCode = response.statusCode;

        return {
          status: statusCode,
          success: true,
          message: data?.message || 'Operação realizada com sucesso',
          data: data?.results || data,
        };
      }),
    );
  }
}
