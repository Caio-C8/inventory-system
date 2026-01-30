import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/persistence/prisma.service';
import { Product, ProductStatusFilter } from '../../core/models/product.model';
import { GetProductsParams } from '../../core/models/catalog.types';
import { PaginatedResult } from 'src/common/models/paginated-result.interface';
import { normalizeString } from 'src/common/utils/string.utils';

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

  async findAll(params: GetProductsParams): Promise<PaginatedResult<Product>> {
    const {
      page,
      limit,
      search,
      max_price,
      max_stock,
      min_price,
      min_stock,
      status,
    } = params;

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      deleted_at:
        status === ProductStatusFilter.ACTIVE
          ? null
          : status === ProductStatusFilter.DELETED
            ? { not: null }
            : undefined,
    };

    if (min_price || max_price) {
      where.sale_price = {
        gte: min_price,
        lte: max_price,
      };
    }

    if (min_stock || max_stock) {
      where.current_stock = {
        gte: min_stock,
        lte: max_stock,
      };
    }

    if (search) {
      where.OR = [
        { name_search: { contains: normalizeString(search) } },
        { code: { contains: search } },
        { barcode: { contains: search } },
      ];
    }

    const [total, data] = await this.prisma.$transaction([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: { batches: true },
        orderBy: { id: 'desc' },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  async softDelete(id: number): Promise<Product> {
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

  async restore(id: number): Promise<Product> {
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

  async updateStock(
    id: number,
    quantity: number,
    operation: 'increment' | 'decrement',
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const client = tx || this.prisma;

    await client.product.update({
      where: { id },
      data: {
        current_stock: {
          [operation]: quantity,
        },
      },
    });
  }

  async setStock(id: number, quantity: number): Promise<void> {
    await this.prisma.product.update({
      where: { id },
      data: {
        current_stock: quantity,
      },
    });
  }

  async findConflicts(
    orConditions: (
      | { name: { equals: string } }
      | { code: { equals: string } }
      | { barcode: { equals: string } }
    )[],
  ): Promise<Product[]> {
    return await this.prisma.product.findMany({
      where: {
        OR: orConditions,
      },
    });
  }
}
