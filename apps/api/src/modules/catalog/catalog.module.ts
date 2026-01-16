import { Module } from '@nestjs/common';
import { ProductController } from './api/product.controller';
import { ProductService } from './core/services/product.service';
import { ProductRepository } from './infrastructure/persistence/product.repository';
import { PrismaService } from 'src/common/persistence/prisma.service';

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, PrismaService],
  exports: [ProductService],
})
export class CatalogModule {}
