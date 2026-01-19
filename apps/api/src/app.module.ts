import { BadRequestException, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { CustomResponse } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception-filter';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { PersistenceModule } from './common/persistence/persistence.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { ValidationError } from 'class-validator';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PersistenceModule,
    AuthModule,
    CatalogModule,
    InventoryModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CustomResponse,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
          transformOptions: {
            enableImplicitConversion: true,
          },
          exceptionFactory(errors: ValidationError[]) {
            const formattedErrors = errors.map((error) => ({
              field: error.property,
              message:
                Object.values(error.constraints || {})[0] ||
                'Erro de validação.',
            }));

            return new BadRequestException({
              message: 'Erro de validação.',
              errors: formattedErrors,
            });
          },
        }),
    },
  ],
})
export class AppModule {}
