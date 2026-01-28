import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BatchRepository } from '../../infrastructure/persistence/batch.repository';
import {
  BatchAllocation,
  CreateBatchParams,
  GetBatchesParams,
  UpdateBatchParams,
} from '../models/inventory.types';
import { Batch } from '../models/batch.model';
import { ProductService } from 'src/modules/catalog/core/services/product.service';
import { PaginatedResult } from 'src/common/models/paginated-result.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class BatchService {
  constructor(
    private readonly batchRepository: BatchRepository,
    private readonly productService: ProductService,
  ) {}

  async create(batchData: CreateBatchParams): Promise<Batch> {
    try {
      await this.productService.findOne(batchData.product_id);
    } catch (error) {
      throw new NotFoundException(
        'Não foi possível criar um lote. O produto não existe.',
      );
    }

    const batch = await this.batchRepository.create(batchData);

    await this.productService.increaseStock(
      batch.product_id,
      batch.current_quantity,
    );

    return batch;
  }

  async update(batchId: number, batchData: UpdateBatchParams): Promise<Batch> {
    const oldBatch = await this.batchRepository.findOne(batchId);

    if (!oldBatch) {
      throw new NotFoundException('Lote não encontrado.');
    }

    if (
      batchData.current_quantity !== undefined &&
      batchData.purchase_quantity !== undefined &&
      batchData.current_quantity > batchData.purchase_quantity
    ) {
      throw new BadRequestException(
        'A quantidade atual não pode ser maior do que a quantidade comprada.',
      );
    }

    if (
      batchData.current_quantity !== undefined &&
      batchData.purchase_quantity === undefined &&
      batchData.current_quantity > oldBatch.purchase_quantity
    ) {
      throw new BadRequestException(
        'A quantidade atual não pode ser maior do que a quantidade comprada.',
      );
    }

    let finalCurrentQty =
      batchData.current_quantity !== undefined
        ? batchData.current_quantity
        : batchData.purchase_quantity !== undefined
          ? oldBatch.current_quantity +
            (batchData.purchase_quantity - oldBatch.purchase_quantity)
          : undefined;

    if (finalCurrentQty !== undefined && finalCurrentQty < 0) {
      throw new BadRequestException(
        'A redução da compra tornaria o estoque atual negativo.',
      );
    }

    const newBatch = await this.batchRepository.update(batchId, {
      ...batchData,
      current_quantity: finalCurrentQty,
    });

    const stockDifference =
      newBatch.current_quantity - oldBatch.current_quantity;

    if (stockDifference > 0) {
      await this.productService.increaseStock(
        newBatch.product_id,
        stockDifference,
      );
    } else if (stockDifference < 0) {
      await this.productService.decreaseStock(
        newBatch.product_id,
        Math.abs(stockDifference),
      );
    }

    return newBatch;
  }

  async findOne(batchId: number): Promise<Batch> {
    const batch = await this.batchRepository.findOne(batchId);

    if (!batch) {
      throw new NotFoundException('Lote não encontrado.');
    }

    return batch;
  }

  async findAllByProduct(
    productId: number,
    getBatchesPrams: GetBatchesParams,
  ): Promise<PaginatedResult<Batch>> {
    try {
      await this.productService.findOne(productId);
    } catch (error) {
      throw new NotFoundException(
        'Não foi possível encontrar os lotes. Produto não encontrado.',
      );
    }

    const result = await this.batchRepository.findByProduct(
      productId,
      getBatchesPrams,
    );

    return {
      data: result.data,
      meta: result.meta,
    };
  }

  async findAll(
    getBatchesPrams: GetBatchesParams,
  ): Promise<PaginatedResult<Batch>> {
    const result = await this.batchRepository.findAll(getBatchesPrams);

    return {
      data: result.data,
      meta: result.meta,
    };
  }

  async delete(batchId: number): Promise<void> {
    const batch = await this.batchRepository.findOne(batchId);

    if (!batch) {
      throw new NotFoundException('Lote não existe.');
    }

    await this.batchRepository.delete(batchId);

    await this.productService.decreaseStock(
      batch.product_id,
      batch.current_quantity,
    );
  }

  async syncStockByProduct(
    productId: number,
  ): Promise<{ synced_stock: number }> {
    const totalQuantity =
      await this.batchRepository.sumQuantityByProduct(productId);

    await this.productService.syncStock(productId, totalQuantity);

    return { synced_stock: totalQuantity };
  }

  async calculateBatchAllocation(
    productId: number,
    quantityNeeded: number,
    saleDate: Date = new Date(),
  ): Promise<{
    unit_cost_snapshot: number;
    allocations: Array<{
      batch_id: number;
      quantity: number;
      unit_cost: number;
    }>;
  }> {
    const batches = await this.batchRepository.findBathcesToSell(
      productId,
      saleDate,
    );

    let remainingQuantity = quantityNeeded;
    const allocations: Array<{
      batch_id: number;
      quantity: number;
      unit_cost: number;
    }> = [];
    let totalCost = 0;

    for (const batch of batches) {
      if (remainingQuantity <= 0) {
        break;
      }

      const available = batch.current_quantity;
      const toTake = Math.min(available, remainingQuantity);

      allocations.push({
        batch_id: batch.id,
        quantity: toTake,
        unit_cost: Number(batch.unit_cost_price),
      });

      totalCost += toTake * Number(batch.unit_cost_price);
      remainingQuantity -= toTake;
    }

    if (remainingQuantity > 0) {
      throw new BadRequestException(
        `Estoque insuficiente para completar a venda. Faltam ${remainingQuantity} unidades.`,
      );
    }

    const unitCostSnapshot = totalCost / quantityNeeded;

    return {
      unit_cost_snapshot: unitCostSnapshot,
      allocations,
    };
  }

  async increaseQuantity(
    batchId: number,
    quantity: number,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    return await this.batchRepository.updateQuantity(
      batchId,
      quantity,
      'increment',
      tx,
    );
  }

  async decreaseQuantity(
    batchId: number,
    quantity: number,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    return await this.batchRepository.updateQuantity(
      batchId,
      quantity,
      'decrement',
      tx,
    );
  }
}
