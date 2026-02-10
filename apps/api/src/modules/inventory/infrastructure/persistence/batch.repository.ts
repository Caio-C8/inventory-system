import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/persistence/prisma.service';
import { Batch } from '../../core/models/batch.model';
import {
  CreateBatchInput,
  GetBatchesInput,
  UpdateBatchInput,
} from '../../core/models/inventory.types';
import { Prisma } from '@prisma/client';
import { PaginatedResult } from '@repo/types';

@Injectable()
export class BatchRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateBatchInput): Promise<Batch> {
    const { product_id, ...batchData } = data;

    const batch = await this.prisma.batch.create({
      data: {
        ...batchData,
        current_quantity: batchData.purchase_quantity,
        product: {
          connect: { id: product_id },
        },
      },
    });

    return this.mapToBatch(batch);
  }

  async update(id: number, data: UpdateBatchInput): Promise<Batch> {
    const batch = await this.prisma.batch.update({
      where: { id },
      data,
    });

    return this.mapToBatch(batch);
  }

  async updateQuantity(
    id: number,
    quantity: number,
    operation: 'increment' | 'decrement',
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const client = tx || this.prisma;

    await client.batch.update({
      where: { id },
      data: {
        current_quantity: { [operation]: quantity },
      },
    });
  }

  async findOne(id: number): Promise<Batch | null> {
    const batch = await this.prisma.batch.findUnique({
      where: { id },
    });

    return batch ? this.mapToBatch(batch) : null;
  }

  async findByProduct(
    productId: number,
    params: GetBatchesInput,
  ): Promise<PaginatedResult<Batch>> {
    const { page, limit } = params;

    const skip = (page - 1) * limit;

    const where = this.getWhereCondition(params);
    where.product_id = productId;

    const [total, data] = await this.prisma.$transaction([
      this.prisma.batch.count({ where }),
      this.prisma.batch.findMany({
        where,
        skip,
        take: limit,
        orderBy: { expiration_date: 'asc' },
      }),
    ]);

    return {
      data: data.map((batch) => this.mapToBatch(batch)),
      meta: {
        total,
        page,
        limit,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  async findAll(params: GetBatchesInput): Promise<PaginatedResult<Batch>> {
    const { page, limit } = params;

    const skip = (page - 1) * limit;

    const where = this.getWhereCondition(params);

    const [total, data] = await this.prisma.$transaction([
      this.prisma.batch.count({ where }),
      this.prisma.batch.findMany({
        where,
        skip,
        take: limit,
        orderBy: { expiration_date: 'asc' },
      }),
    ]);

    return {
      data: data.map((batch) => this.mapToBatch(batch)),
      meta: {
        total,
        page,
        limit,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  async findBathcesToSell(
    productId: number,
    saleDate: Date = new Date(),
    tx?: Prisma.TransactionClient,
  ): Promise<Batch[]> {
    const client = tx || this.prisma;

    const batches = await client.batch.findMany({
      where: {
        product_id: productId,
        current_quantity: { gt: 0 },
        expiration_date: { gt: saleDate },
        product: {
          deleted_at: null,
        },
      },
      orderBy: { expiration_date: 'asc' },
    });

    return batches.map((batch) => this.mapToBatch(batch));
  }

  async delete(id: number, tx?: Prisma.TransactionClient): Promise<void> {
    const client = tx || this.prisma;

    await client.batch.delete({ where: { id } });
  }

  async sumQuantityByProduct(productId: number): Promise<number> {
    const result = await this.prisma.batch.aggregate({
      where: { product_id: productId },
      _sum: {
        current_quantity: true,
      },
    });

    return result._sum.current_quantity || 0;
  }

  private getWhereCondition(params: GetBatchesInput) {
    const {
      min_expiration_date,
      max_expiration_date,
      min_purchase_date,
      max_purchase_date,
      min_unit_cost_price,
      max_unit_cost_price,
      min_current_quantity,
      max_current_quantity,
      min_purchase_quantity,
      max_purchase_quantity,
    } = params;

    const whereCondition: Prisma.BatchWhereInput = {};

    if (min_expiration_date || max_expiration_date) {
      whereCondition.expiration_date = {
        gte: min_expiration_date,
        lte: max_expiration_date,
      };
    }

    if (min_purchase_date || max_purchase_date) {
      whereCondition.purchase_date = {
        gte: min_purchase_date,
        lte: max_purchase_date,
      };
    }

    if (min_unit_cost_price || max_unit_cost_price) {
      whereCondition.unit_cost_price = {
        gte: min_unit_cost_price,
        lte: max_unit_cost_price,
      };
    }

    if (min_current_quantity || max_current_quantity) {
      whereCondition.current_quantity = {
        gte: min_current_quantity,
        lte: max_current_quantity,
      };
    }

    if (min_purchase_quantity || max_purchase_quantity) {
      whereCondition.purchase_quantity = {
        gte: min_purchase_quantity,
        lte: max_purchase_quantity,
      };
    }

    return whereCondition;
  }

  private mapToBatch(prismaBatch: any): Batch {
    return {
      id: prismaBatch.id,
      tax_invoice_number: prismaBatch.tax_invoice_number,
      unit_cost_price: Number(prismaBatch.unit_cost_price),
      expiration_date: prismaBatch.expiration_date,
      purchase_date: prismaBatch.purchase_date,
      current_quantity: prismaBatch.current_quantity,
      purchase_quantity: prismaBatch.purchase_quantity,
      product_id: prismaBatch.product_id,
    };
  }
}
