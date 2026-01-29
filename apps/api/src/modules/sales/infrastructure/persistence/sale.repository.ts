import { ConsoleLogger, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/persistence/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateSale, UpdateSalePrams } from '../../core/models/sales.types';
import {
  CompleteSale,
  Sale,
  SaleStatus,
  SaleWithItems,
  SaleWithAllocations,
} from '../../core/models/sale.model';

@Injectable()
export class SaleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSale, tx: Prisma.TransactionClient): Promise<Sale> {
    const sale = await tx.sale.create({
      data: {
        channel: data.channel,
        sale_date: data.sale_date,
        status: data.status,
        total_value: data.total_value,
        customer: {
          connect: { id: data.customer_id },
        },
      },
    });

    for (const item of data.items) {
      const saleItem = await tx.saleItem.create({
        data: {
          quantity: item.quantity,
          unit_sale_price: item.unit_sale_price,
          unit_cost_snapshot: item.unit_cost_snapshot,
          sale: {
            connect: { id: sale.id },
          },
          product: {
            connect: { id: item.product_id },
          },
        },
      });

      if (item.allocations.length > 0) {
        await tx.allocationSaleItem.createMany({
          data: item.allocations.map((alloc) => ({
            quantity: alloc.quantity,
            sale_item_id: saleItem.id,
            batch_id: alloc.batch_id,
          })),
        });
      }
    }

    return sale;
  }

  async update(
    id: number,
    data: UpdateSalePrams,
  ): Promise<CompleteSale | SaleWithItems> {
    return await this.prisma.sale.update({
      where: { id },
      data,
      include: {
        customer: true,
        saleItems: true,
      },
    });
  }

  async updateStatus(
    id: number,
    status: SaleStatus,
    tx?: Prisma.TransactionClient,
  ): Promise<CompleteSale | SaleWithItems> {
    const client = tx || this.prisma;

    return await client.sale.update({
      where: { id },
      data: {
        status: status,
      },
      include: {
        customer: true,
        saleItems: true,
      },
    });
  }

  async updateTotalValue(
    id: number,
    newTotal: number,
    tx: Prisma.TransactionClient,
  ) {
    return await tx.sale.update({
      where: { id },
      data: { total_value: newTotal },
      include: {
        saleItems: true,
      },
    });
  }

  async findOne(id: number): Promise<CompleteSale | SaleWithItems | null> {
    return await this.prisma.sale.findUnique({
      where: { id },
      include: {
        customer: true,
        saleItems: true,
      },
    });
  }

  async findAll(): Promise<CompleteSale[] | SaleWithItems[]> {
    return await this.prisma.sale.findMany({
      include: { customer: true, saleItems: true },
    });
  }

  async findSaleWithItems(id: number): Promise<SaleWithAllocations | null> {
    return await this.prisma.sale.findUnique({
      where: { id },
      include: {
        saleItems: {
          include: {
            batchAllocations: true,
          },
        },
      },
    });
  }
}
