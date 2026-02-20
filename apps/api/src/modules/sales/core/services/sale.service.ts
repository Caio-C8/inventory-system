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
  CreateSaleInput,
  GetSalesForReportInput,
  GetSalesInput,
  SalesReportMetric,
  SalesReportResponse,
  UpdateSaleInput,
  SaleItemInternal,
  SaleInternalCreate,
} from '../models/sales.types';
import { PrismaService } from 'src/common/persistence/prisma.service';
import {
  CompleteSale,
  Sale,
  SaleStatus,
  SaleWithItems,
} from '../models/sale.model';
import { PaginatedResult } from '@repo/types';

@Injectable()
export class SaleService {
  constructor(
    private readonly saleRepository: SaleRepository,
    private readonly batchService: BatchService,
    private readonly productService: ProductService,
    private readonly customerService: CustomerService,
    private readonly prisma: PrismaService,
  ) {}

  async create(saleData: CreateSaleInput): Promise<Sale> {
    const customer = await this.customerService.findOne(saleData.customer_id);

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado.');
    }

    if (customer.deleted_at) {
      throw new BadRequestException(`Cliente ${customer.name} está deletado.`);
    }

    if (!saleData.saleItems || saleData.saleItems.length <= 0) {
      throw new BadRequestException('A venda deve ter pelo menos um item.');
    }

    const preparedItems: SaleItemInternal[] = [];

    let finalTotalValue = 0;

    if (saleData.total_value && saleData.total_value > 0) {
      finalTotalValue = saleData.total_value;
    }

    const shouldCalculateTotal = finalTotalValue === 0;

    for (const item of saleData.saleItems) {
      const allocationResult = await this.batchService.calculateBatchAllocation(
        item.product_id,
        item.quantity,
        saleData.sale_date,
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

    const createSaleData: SaleInternalCreate = {
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
    saleData: UpdateSaleInput,
  ): Promise<CompleteSale | SaleWithItems> {
    if (Object.keys(saleData).length === 0) {
      throw new BadRequestException('Nenhum dado fornecido para atualização.');
    }

    const sale = await this.saleRepository.findOne(saleId);

    if (!sale) {
      throw new NotFoundException('Venda não encontrada.');
    }

    if (sale.status === SaleStatus.CANCELED) {
      throw new BadRequestException(
        'Não é possível alterar uma venda cancelada.',
      );
    }

    if (saleData.customer_id) {
      const customer = await this.customerService.findOne(saleData.customer_id);

      if (!customer) {
        throw new NotFoundException('Cliente não encontrado.');
      }

      if (customer.deleted_at) {
        throw new BadRequestException(
          `Não é possível atribuir essa venda ao cliente ${customer.name}. Cliente está deletado.`,
        );
      }
    }

    return await this.saleRepository.update(saleId, saleData);
  }

  async findOne(saleId: number): Promise<CompleteSale | SaleWithItems> {
    const sale = await this.saleRepository.findOne(saleId);

    if (!sale) {
      throw new NotFoundException('Venda não encontrada.');
    }

    return sale;
  }

  async findAll(getSalesParams: GetSalesInput): Promise<PaginatedResult<Sale>> {
    const result = await this.saleRepository.findAll(getSalesParams);

    return {
      data: result.data,
      meta: result.meta,
    };
  }

  async generateReport(
    paramsForReport: GetSalesForReportInput,
  ): Promise<SalesReportResponse> {
    const sales = await this.saleRepository.findSalesForReport(paramsForReport);

    const reportMap = new Map<string, SalesReportMetric>();

    const grandTotal: SalesReportMetric = {
      channel: 'TOTAL',
      count: 0,
      total_revenue: 0,
      total_cost: 0,
      total_profit: 0,
    };

    for (const sale of sales) {
      const channelName = sale.channel;

      if (!reportMap.has(channelName)) {
        reportMap.set(channelName, {
          channel: channelName,
          count: 0,
          total_revenue: 0,
          total_cost: 0,
          total_profit: 0,
        });
      }

      const channelMetric = reportMap.get(channelName)!;

      let saleCost = 0;
      for (const item of sale.saleItems) {
        saleCost += Number(item.unit_cost_snapshot) * item.quantity;
      }

      const saleRevenue = Number(sale.total_value);
      const saleProfit = saleRevenue - saleCost;

      channelMetric.count += 1;
      channelMetric.total_revenue += saleRevenue;
      channelMetric.total_cost += saleCost;
      channelMetric.total_profit += saleProfit;

      grandTotal.count += 1;
      grandTotal.total_revenue += saleRevenue;
      grandTotal.total_cost += saleCost;
      grandTotal.total_profit += saleProfit;
    }

    return {
      period: {
        start: paramsForReport.start_date,
        end: paramsForReport.end_date,
      },
      by_channel: Array.from(reportMap.values()),
      grand_total: grandTotal,
    };
  }

  async cancel(saleId: number): Promise<CompleteSale | SaleWithItems> {
    const sale = await this.saleRepository.findSaleWithItems(saleId);

    if (!sale) {
      throw new BadRequestException('Venda não encontrada.');
    }

    if (sale.status === SaleStatus.CANCELED) {
      throw new BadRequestException('Venda já está cancelada.');
    }

    return await this.prisma.$transaction(async (tx) => {
      for (const item of sale.saleItems) {
        for (const alloc of item.batchAllocations) {
          await this.batchService.increaseQuantity(
            alloc.batch_id,
            alloc.quantity,
            tx,
          );
        }

        await this.productService.increaseStock(
          item.product_id,
          item.quantity,
          tx,
        );
      }

      return await this.saleRepository.updateStatus(
        saleId,
        SaleStatus.CANCELED,
        tx,
      );
    });
  }

  async restore(saleId: number): Promise<CompleteSale | SaleWithItems> {
    const sale = await this.saleRepository.findSaleWithItems(saleId);

    if (!sale) {
      throw new BadRequestException('Venda não encontrada.');
    }

    if (sale.status !== SaleStatus.CANCELED) {
      throw new BadRequestException('Venda já está ativa.');
    }

    return await this.prisma.$transaction(async (tx) => {
      for (const item of sale.saleItems) {
        for (const alloc of item.batchAllocations) {
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

      return await this.saleRepository.updateStatus(
        saleId,
        SaleStatus.COMPLETED,
      );
    });
  }
}
