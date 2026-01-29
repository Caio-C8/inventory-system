import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SaleItemRepository } from '../../infrastructure/persistence/sale-item.repository';
import { SaleRepository } from '../../infrastructure/persistence/sale.repository'; // Para atualizar o total
import { BatchService } from '../../../inventory/core/services/batch.service';
import { ProductService } from '../../../catalog/core/services/product.service';
import { PrismaService } from 'src/common/persistence/prisma.service';
import { SaleStatus } from '../models/sale.model';
import { UpdateItemSaleParams } from '../models/sales.types';

@Injectable()
export class SaleItemService {
  constructor(
    private readonly saleItemRepository: SaleItemRepository,
    private readonly saleRepository: SaleRepository,
    private readonly batchService: BatchService,
    private readonly productService: ProductService,
    private readonly prisma: PrismaService,
  ) {}

  async update(saleItemId: number, updateData: UpdateItemSaleParams) {
    const currentItem = await this.saleItemRepository.findOne(saleItemId);

    if (!currentItem) {
      throw new NotFoundException('Item da venda não encontrado.');
    }

    if (currentItem.sale.status === SaleStatus.CANCELED) {
      throw new BadRequestException(
        'Não é possível editar itens de uma venda cancelada.',
      );
    }

    const targetProductId = updateData.product_id || currentItem.product_id;
    const targetQuantity = updateData.quantity || currentItem.quantity;
    const targetPrice =
      updateData.unit_sale_price || Number(currentItem.unit_sale_price);

    const hasInventoryChange =
      targetProductId !== currentItem.product_id ||
      targetQuantity !== currentItem.quantity;

    return await this.prisma.$transaction(async (tx) => {
      let newUnitCostSnapshot = Number(currentItem.unit_cost_snapshot);

      if (hasInventoryChange) {
        for (const alloc of currentItem.batchAllocations) {
          await this.batchService.increaseQuantity(
            alloc.batch_id,
            alloc.quantity,
            tx,
          );
        }

        await this.productService.increaseStock(
          currentItem.product_id,
          currentItem.quantity,
          tx,
        );

        await this.saleItemRepository.deleteAllocations(currentItem.id, tx);

        const allocationResult =
          await this.batchService.calculateBatchAllocation(
            targetProductId,
            targetQuantity,
            currentItem.sale.sale_date,
            tx,
          );

        newUnitCostSnapshot = allocationResult.unit_cost_snapshot;

        await this.saleItemRepository.createAllocations(
          currentItem.id,
          allocationResult.allocations,
          tx,
        );

        for (const alloc of allocationResult.allocations) {
          await this.batchService.decreaseQuantity(
            alloc.batch_id,
            alloc.quantity,
            tx,
          );
        }

        await this.productService.decreaseStock(
          targetProductId,
          targetQuantity,
          tx,
        );

        await this.saleItemRepository.update(
          currentItem.id,
          {
            product_id: targetProductId,
            quantity: targetQuantity,
            unit_sale_price: targetPrice,
            unit_cost_snapshot: newUnitCostSnapshot,
          },
          tx,
        );

        const oldItemTotal =
          currentItem.quantity * Number(currentItem.unit_sale_price);
        const newItemTotal = targetQuantity * targetPrice;

        const currentTotalValue = Number(currentItem.sale.total_value);
        const newTotalValue = currentTotalValue - oldItemTotal + newItemTotal;

        return this.saleRepository.updateTotalValue(
          currentItem.sale_id,
          newTotalValue,
          tx,
        );
      }
    });
  }

  async delete(saleItemId: number): Promise<void> {
    await this.saleItemRepository.delete(saleItemId);
  }
}
