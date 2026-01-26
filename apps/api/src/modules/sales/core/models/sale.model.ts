import {
  SaleStatus as PrismaSaleStatus,
  Sale as PrismaSale,
  ItemSale as PrimsaItemSale,
  Customer as PrismaCustomer,
} from '@prisma/client';

export const SaleStatus = PrismaSaleStatus;
export type SaleStatus = PrismaSaleStatus;

export type Sale = PrismaSale;

export type CompleteSale = PrismaSale &
  PrismaCustomer & {
    itemsSale: PrimsaItemSale[];
  };

export type SaleWithItems = PrismaSale & {
  itemsSale: PrimsaItemSale[];
};
