import { SaleStatus } from './sale.model';

export interface StockAllocationResult {
  product_id: number;
  quantity_requested: number;
  unit_cost_snapshot: number;
  allocations: Array<{
    batch_id: number;
    quantity: number;
  }>;
}

export interface CreateSale {
  channel: string;
  sale_date: Date;
  status: SaleStatus;
  customer_id: number;
  total_value: number;
  items: Array<{
    product_id: number;
    quantity: number;
    unit_sale_price: number;
    unit_cost_snapshot: number;
    allocations: Array<{
      batch_id: number;
      quantity: number;
    }>;
  }>;
}

export interface CreateItemSaleParams {
  product_id: number;
  quantity: number;
  unit_sale_price: number;
}

export interface CreateSaleParams {
  channel: string;
  sale_date: Date;
  status: SaleStatus;
  customer_id: number;
  itemsSale: CreateItemSaleParams[];
}

export interface UpdateSalePrams {
  channel?: string;
  sale_date?: Date;
  status?: SaleStatus;
  customer_id?: number;
}
