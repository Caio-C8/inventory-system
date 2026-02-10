import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/persistence/prisma.service';
import { Prisma } from '@prisma/client';
import { SaleItem, SaleItemWithRelations } from '../../core/models/sale.model';
import { UpdateSaleItemInput } from '../../core/models/sales.types';

@Injectable()
export class SaleItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async update(
    id: number,
    data: UpdateSaleItemInput,
    tx?: Prisma.TransactionClient,
  ): Promise<SaleItem> {
    const client = tx || this.prisma;

    const saleItem = await client.saleItem.update({
      where: { id },
      data,
    });

    return this.mapToSaleItem(saleItem);
  }

  async findOne(id: number): Promise<SaleItemWithRelations | null> {
    const saleItem = await this.prisma.saleItem.findUnique({
      where: { id },
      include: {
        batchAllocations: true,
        sale: {
          include: { saleItems: true },
        },
      },
    });

    return saleItem ? this.mapToSaleItemWithRelations(saleItem) : null;
  }

  async delete(id: number, tx?: Prisma.TransactionClient): Promise<void> {
    const client = tx || this.prisma;
    await client.saleItem.delete({ where: { id } });
  }

  async createAllocations(
    saleItemId: number,
    allocations: { batch_id: number; quantity: number }[],
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    await tx.allocationSaleItem.createMany({
      data: allocations.map((alloc) => ({
        sale_item_id: saleItemId,
        batch_id: alloc.batch_id,
        quantity: alloc.quantity,
      })),
    });
  }

  async deleteAllocations(
    saleItemId: number,
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    await tx.allocationSaleItem.deleteMany({
      where: { sale_item_id: saleItemId },
    });
  }

  private mapToSaleItem(prismaSaleItem: any): SaleItem {
    return {
      id: prismaSaleItem.id,
      unit_cost_snapshot: Number(prismaSaleItem.unit_cost_snapshot),
      quantity: prismaSaleItem.quantity,
      unit_sale_price: Number(prismaSaleItem.unit_sale_price),
      product_id: prismaSaleItem.product_id,
      sale_id: prismaSaleItem.sale_id,
    };
  }

  private mapToSaleItemWithRelations(
    prismaSaleItem: any,
  ): SaleItemWithRelations {
    return {
      ...this.mapToSaleItem(prismaSaleItem),
      batchAllocations: prismaSaleItem.batchAllocations || [],
      sale: prismaSaleItem.sale
        ? {
            ...prismaSaleItem.sale,
            total_value: Number(prismaSaleItem.sale.total_value),
            saleItems:
              prismaSaleItem.sale.saleItems?.map((item: any) =>
                this.mapToSaleItem(item),
              ) || [],
          }
        : undefined,
    };
  }
}
