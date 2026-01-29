import {
  Sale as PrismaSale,
  ItemSale as PrismaItemSale,
  Customer as PrismaCustomer,
  AllocationItemSale as PrismaAllocationItemSale,
  SaleStatus as PrismaSaleStatus,
} from '@prisma/client';

export const SaleStatus = PrismaSaleStatus;
export type SaleStatus = PrismaSaleStatus;

export type Sale = PrismaSale;
export type ItemSale = PrismaItemSale;

export type SaleWithItems = PrismaSale & {
  itemsSale: PrismaItemSale[];
};

export type CompleteSale = PrismaSale & {
  customer: PrismaCustomer;
  itemsSale: PrismaItemSale[];
};

export type ItemSaleWithAllocations = PrismaItemSale & {
  batchAllocations: PrismaAllocationItemSale[];
};

export type SaleWithAllocations = PrismaSale & {
  itemsSale: Array<ItemSaleWithAllocations>;
};

export type AllocationItemSale = PrismaAllocationItemSale;
