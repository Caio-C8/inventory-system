import { ProductStatusFilter } from './product.model';

export interface CreateProductParams {
  name: string;
  code: string;
  barcode: string;
  sale_price: number;
}

export interface UpdateProductParams {
  name?: string;
  code?: string;
  barcode?: string;
  sale_price?: number;
}

export interface GetProductsParams {
  page: number;
  limit: number;
  search?: string;
  status?: ProductStatusFilter;
  min_price?: number;
  max_price?: number;
  min_stock?: number;
  max_stock?: number;
}
