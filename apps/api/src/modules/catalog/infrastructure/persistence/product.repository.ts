import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/persistence/prisma.service';
import { Product } from '../../core/models/product.model';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    return await this.prisma.product.create({ data });
  }

  async update(id: number, data: Prisma.ProductUpdateInput): Promise<Product> {
    return await this.prisma.product.update({
      where: { id },
      data,
      include: {
        batches: true,
      },
    });
  }

  async findOne(id: number): Promise<Product | null> {
    return await this.prisma.product.findUnique({
      where: { id },
      include: {
        batches: true,
      },
    });
  }

  async findAll(): Promise<Product[]> {
    return await this.prisma.product.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        batches: true,
      },
    });
  }

  async softDelete(id: number) {
    return await this.prisma.product.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
      include: {
        batches: true,
      },
    });
  }

  async restore(id: number) {
    return await this.prisma.product.update({
      where: { id },
      data: {
        deleted_at: null,
      },
      include: {
        batches: true,
      },
    });
  }
}
