import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/persistence/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SaleItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async update(
    id: number,
    data: {
      product_id?: number;
      quantity?: number;
      unit_sale_price?: number;
      unit_cost_snapshot?: number;
    },
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || this.prisma;
    return await client.saleItem.update({
      where: { id },
      data,
    });
  }

  async findOne(id: number) {
    return await this.prisma.saleItem.findUnique({
      where: { id },
      include: {
        batchAllocations: true,
        sale: true,
      },
    });
  }

  async delete(id: number, tx?: Prisma.TransactionClient): Promise<void> {
    const client = tx || this.prisma;
    await client.saleItem.delete({ where: { id } });
  }

  async createAllocations(
    saleItemId: number,
    allocations: { batch_id: number; quantity: number }[],
    tx: Prisma.TransactionClient,
  ) {
    return await tx.allocationSaleItem.createMany({
      data: allocations.map((alloc) => ({
        sale_item_id: saleItemId,
        batch_id: alloc.batch_id,
        quantity: alloc.quantity,
      })),
    });
  }

  async deleteAllocations(saleItemId: number, tx: Prisma.TransactionClient) {
    return await tx.allocationSaleItem.deleteMany({
      where: { sale_item_id: saleItemId },
    });
  }
}
