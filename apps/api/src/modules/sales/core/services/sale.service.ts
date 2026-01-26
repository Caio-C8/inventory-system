import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SaleRepository } from '../../infrastructure/persistence/sale.repository';
import { BatchService } from '../../../inventory/core/services/batch.service';
import { ProductService } from '../../../catalog/core/services/product.service';
import { CustomerService } from '../../../customers/core/services/customer.service';
import {
  CreateSale,
  CreateSaleParams,
  UpdateSalePrams,
} from '../models/sales.types';
import { PrismaService } from 'src/common/persistence/prisma.service';
import {
  CompleteSale,
  Sale,
  SaleStatus,
  SaleWithItems,
} from '../models/sale.model';

@Injectable()
export class SaleService {
  constructor(
    private readonly saleRepository: SaleRepository,
    private readonly batchService: BatchService,
    private readonly productService: ProductService,
    private readonly customerService: CustomerService,
    private readonly prisma: PrismaService,
  ) {}

  async create(saleData: CreateSaleParams): Promise<Sale> {
    const customer = await this.customerService.findOne(saleData.customer_id);

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado.');
    }

    if (!saleData.itemsSale || saleData.itemsSale.length <= 0) {
      throw new BadRequestException('A venda deve ter pelo menos um item.');
    }

    const preparedItems: CreateSale['items'] = [];

    let finalTotalValue = 0;

    if (saleData.total_value && saleData.total_value > 0) {
      finalTotalValue = saleData.total_value;
    }

    const shouldCalculateTotal = finalTotalValue === 0;

    for (const item of saleData.itemsSale) {
      const allocationResult = await this.batchService.calculateBatchAllocation(
        item.product_id,
        item.quantity,
      );

      preparedItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_sale_price: item.unit_sale_price,
        unit_cost_snapshot: allocationResult.unit_cost_snapshot,
        allocations: allocationResult.allocations.map(
          (alloc: { batch_id: number; quantity: number }) => ({
            batch_id: alloc.batch_id,
            quantity: alloc.quantity,
          }),
        ),
      });

      if (shouldCalculateTotal) {
        finalTotalValue += item.quantity * item.unit_sale_price;
      }
    }

    const createSaleData: CreateSale = {
      channel: saleData.channel,
      sale_date: saleData.sale_date,
      status: saleData.status,
      customer_id: saleData.customer_id,
      total_value: finalTotalValue,
      items: preparedItems,
    };

    return this.prisma.$transaction(async (tx) => {
      const createdSale = await this.saleRepository.create(createSaleData, tx);

      for (const item of createSaleData.items) {
        for (const alloc of item.allocations) {
          await this.batchService.decreaseQuantity(
            alloc.batch_id,
            alloc.quantity,
            tx,
          );
        }

        await this.productService.decreaseStock(
          item.product_id,
          item.quantity,
          tx,
        );
      }

      return createdSale;
    });
  }

  async update(
    saleId: number,
    saleData: UpdateSalePrams,
  ): Promise<CompleteSale | SaleWithItems> {
    const sale = await this.saleRepository.findOne(saleId);

    if (!sale) {
      throw new BadRequestException('Venda não encontrada.');
    }

    return await this.saleRepository.update(saleId, saleData);
  }

  async findOne(saleId: number): Promise<CompleteSale | SaleWithItems> {
    const sale = await this.saleRepository.findOne(saleId);

    if (!sale) {
      throw new BadRequestException('Venda não encontrada.');
    }

    return sale;
  }

  async findAll(): Promise<CompleteSale[] | SaleWithItems[]> {
    return await this.saleRepository.findAll();
  }

  async cancel(saleId: number): Promise<CompleteSale | SaleWithItems> {
    const sale = await this.saleRepository.findOne(saleId);

    if (!sale) {
      throw new BadRequestException('Venda não encontrada.');
    }

    if (sale.status === SaleStatus.CANCELED) {
      throw new BadRequestException('Venda já está cancelada.');
    }

    return await this.saleRepository.cancel(saleId);
  }

  async restore(saleId: number): Promise<CompleteSale | SaleWithItems> {
    const sale = await this.saleRepository.findOne(saleId);

    if (!sale) {
      throw new BadRequestException('Venda não encontrada.');
    }

    if (sale.status !== SaleStatus.CANCELED) {
      throw new BadRequestException('Venda já está habilitada.');
    }

    return await this.saleRepository.restore(saleId);
  }
}
