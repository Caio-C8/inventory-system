import {
  Sale as PrismaSale,
  SaleItem as PrismaSaleItem,
  Customer as PrismaCustomer,
  AllocationSaleItem as PrismaAllocationSaleItem,
  SaleStatus as PrismaSaleStatus,
} from '@prisma/client';

export const SaleStatus = PrismaSaleStatus;
export type SaleStatus = PrismaSaleStatus;

export type Sale = PrismaSale;
export type SaleItem = PrismaSaleItem;

export type SaleWithItems = PrismaSale & {
  saleItems: PrismaSaleItem[];
};

export type CompleteSale = PrismaSale & {
  customer: PrismaCustomer;
  saleItems: PrismaSaleItem[];
};

export type SaleItemWithAllocations = PrismaSaleItem & {
  batchAllocations: PrismaAllocationSaleItem[];
};

export type SaleWithAllocations = PrismaSale & {
  saleItems: Array<SaleItemWithAllocations>;
};

export type AllocationSaleItem = PrismaAllocationSaleItem;
