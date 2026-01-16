import { Product as PrismaProduct, Batch as PrismaBatch } from '@prisma/client';

export type Product = PrismaProduct & {
  batches?: PrismaBatch[];
};

export type ProductWithStock = Product & {
  total_quantity: number;
};

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
