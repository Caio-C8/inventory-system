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
import { resourceUsage } from 'process';

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
      const itemSale = await tx.itemSale.create({
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
        await tx.allocationItemSale.createMany({
          data: item.allocations.map((alloc) => ({
            quantity: alloc.quantity,
            item_sale_id: itemSale.id,
            batch_id: alloc.batch_id,
          })),
        });
      }
    }

    return sale;
  }

  async createAllocations(
    itemSaleId: number,
    allocations: Array<{
      batch_id: number;
      quantity: number;
    }>,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || this.prisma;

    return await client.allocationItemSale.createMany({
      data: allocations.map((alloc) => ({
        item_sale_id: itemSaleId,
        batch_id: alloc.batch_id,
        quantity: alloc.quantity,
      })),
    });
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
        itemsSale: true,
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
        itemsSale: true,
      },
    });
  }

  async findOne(id: number): Promise<CompleteSale | SaleWithItems | null> {
    return await this.prisma.sale.findUnique({
      where: { id },
      include: {
        customer: true,
        itemsSale: true,
      },
    });
  }

  async findAll(): Promise<CompleteSale[] | SaleWithItems[]> {
    return await this.prisma.sale.findMany({
      include: { customer: true, itemsSale: true },
    });
  }

  async findSaleWithItems(id: number): Promise<SaleWithAllocations | null> {
    return await this.prisma.sale.findUnique({
      where: { id },
      include: {
        itemsSale: {
          include: {
            batchAllocations: true,
          },
        },
      },
    });
  }
}
