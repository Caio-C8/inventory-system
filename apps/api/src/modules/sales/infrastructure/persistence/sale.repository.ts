import { ConsoleLogger, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/persistence/prisma.service';
import { Prisma } from '@prisma/client';
import {
  CreateSale,
  GetSalesParams,
  UpdateSalePrams,
} from '../../core/models/sales.types';
import {
  CompleteSale,
  Sale,
  SaleStatus,
  SaleWithItems,
  SaleWithAllocations,
} from '../../core/models/sale.model';
import { PaginatedResult } from 'src/common/models/paginated-result.interface';
import { normalizeString } from 'src/common/utils/string.utils';

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

  async findAll(params: GetSalesParams): Promise<PaginatedResult<Sale>> {
    const {
      page,
      limit,
      channel,
      min_sale_date,
      max_sale_date,
      min_total_value,
      max_total_value,
      search,
      status,
    } = params;

    const skip = (page - 1) * limit;

    const where: Prisma.SaleWhereInput = {};

    if (search) {
      where.OR = [
        {
          customer: {
            name_search: {
              contains: normalizeString(search),
            },
          },
        },
      ];

      if (!isNaN(Number(search))) {
        where.OR.push({ id: Number(search) });
      }
    }

    if (channel) {
      where.channel = {
        equals: channel,
      };
    }

    if (min_sale_date || max_sale_date) {
      where.sale_date = {
        gte: min_sale_date,
        lte: max_sale_date,
      };
    }

    if (min_total_value || max_total_value) {
      where.total_value = {
        gte: min_total_value,
        lte: max_total_value,
      };
    }

    if (status) {
      where.status = {
        equals: status,
      };
    }

    const [total, data] = await this.prisma.$transaction([
      this.prisma.sale.count({ where }),
      this.prisma.sale.findMany({
        where,
        skip,
        take: limit,
        orderBy: { sale_date: 'desc' },
        include: {
          customer: true,
          saleItems: true,
        },
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
