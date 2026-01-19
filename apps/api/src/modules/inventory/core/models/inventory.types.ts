export interface CreateBatchParams {
  tax_invoice_number: string;
  unit_cost_price: number;
  expiration_date: Date;
  purchase_date: Date;
  purchase_quantity: number;
  product_id: number;
}

export interface UpdateBatchParams {
  tax_invoice_number?: string;
  unit_cost_price?: number;
  expiration_date?: Date;
  purchase_date?: Date;
  current_quantity?: number;
  purchase_quantity?: number;
}

export interface GetBatchesParams {
  page: number;
  limit: number;
  min_expiration_date?: Date;
  max_expiration_date?: Date;
  min_purchase_date?: Date;
  max_purchase_date?: Date;
  min_unit_cost_price?: number;
  max_unit_cost_price?: number;
  min_current_quantity?: number;
  max_current_quantity?: number;
  min_purchase_quantity?: number;
  max_purchase_quantity?: number;
}
