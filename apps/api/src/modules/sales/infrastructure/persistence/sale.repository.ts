import { ConsoleLogger, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/persistence/prisma.service';
import { Prisma } from '@prisma/client';
import {
  SaleInternalCreate,
  GetSalesForReportInput,
  GetSalesInput,
  UpdateSaleInput,
} from '../../core/models/sales.types';
import {
  CompleteSale,
  Sale,
  SaleStatus,
  SaleWithItems,
  SaleWithAllocations,
} from '../../core/models/sale.model';
import { PaginatedResult, SaleItemWithAllocations } from '@repo/types';
import { normalizeString } from '@repo/utils';

@Injectable()
export class SaleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: SaleInternalCreate,
    tx: Prisma.TransactionClient,
  ): Promise<Sale> {
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

    return this.mapToSale(sale);
  }

  async update(
    id: number,
    data: UpdateSaleInput,
  ): Promise<CompleteSale | SaleWithItems> {
    const sale = await this.prisma.sale.update({
      where: { id },
      data,
      include: {
        customer: true,
        saleItems: true,
      },
    });

    return this.mapToCompleteSale(sale);
  }

  async updateStatus(
    id: number,
    status: SaleStatus,
    tx?: Prisma.TransactionClient,
  ): Promise<CompleteSale | SaleWithItems> {
    const client = tx || this.prisma;

    const sale = await client.sale.update({
      where: { id },
      data: {
        status: status,
      },
      include: {
        customer: true,
        saleItems: true,
      },
    });

    return this.mapToCompleteSale(sale);
  }

  async updateTotalValue(
    id: number,
    newTotal: number,
    tx: Prisma.TransactionClient,
  ): Promise<SaleWithItems> {
    const sale = await tx.sale.update({
      where: { id },
      data: { total_value: newTotal },
      include: {
        saleItems: true,
      },
    });

    return this.mapToCompleteSale(sale);
  }

  async findOne(id: number): Promise<CompleteSale | SaleWithItems | null> {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: {
        customer: true,
        saleItems: true,
      },
    });

    return sale ? this.mapToCompleteSale(sale) : null;
  }

  async findAll(params: GetSalesInput): Promise<PaginatedResult<Sale>> {
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
      data: data.map((sale) => this.mapToCompleteSale(sale)),
      meta: {
        total,
        page,
        limit,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  async findSaleWithItems(id: number): Promise<SaleWithAllocations | null> {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: {
        saleItems: {
          include: {
            batchAllocations: true,
          },
        },
      },
    });

    return sale ? this.mapToSaleWithAllocations(sale) : null;
  }

  async findSalesForReport(
    params: GetSalesForReportInput,
  ): Promise<SaleWithItems[]> {
    const { start_date, end_date, channel } = params;

    const where: Prisma.SaleWhereInput = {
      status: SaleStatus.COMPLETED,
      sale_date: {
        gte: start_date,
        lte: end_date,
      },
    };

    if (channel) {
      where.channel = channel;
    }

    const sales = await this.prisma.sale.findMany({
      where,
      include: {
        saleItems: true,
      },
    });

    return sales.map((sale) => this.mapToCompleteSale(sale));
  }

  private mapToSale(prismaSale: any): Sale {
    return {
      id: prismaSale.id,
      status: prismaSale.status as SaleStatus,
      channel: prismaSale.channel,
      total_value: Number(prismaSale.total_value),
      sale_date: prismaSale.sale_date,
      customer_id: prismaSale.customer_id,
    };
  }

  private mapToSaleItem(prismaSaleItem: any): SaleItemWithAllocations {
    return {
      id: prismaSaleItem.id,
      unit_cost_snapshot: Number(prismaSaleItem.unit_cost_snapshot),
      quantity: prismaSaleItem.quantity,
      unit_sale_price: Number(prismaSaleItem.unit_sale_price),
      product_id: prismaSaleItem.product_id,
      sale_id: prismaSaleItem.sale_id,
      batchAllocations: prismaSaleItem.batchAllocations || [],
    };
  }

  private mapToCompleteSale(prismaSale: any): CompleteSale {
    return {
      ...this.mapToSale(prismaSale),
      customer: prismaSale.customer || undefined,
      saleItems:
        prismaSale.saleItems?.map((item: any) => this.mapToSaleItem(item)) ||
        [],
    };
  }

  private mapToSaleWithAllocations(prismaSale: any): SaleWithAllocations {
    return {
      ...this.mapToSale(prismaSale),
      saleItems:
        prismaSale.saleItems?.map((item: any) => this.mapToSaleItem(item)) ||
        [],
    };
  }
}
