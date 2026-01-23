import {
  SaleStatus as PrismaSaleStatus,
  Sale as PrismaSale,
} from '@prisma/client';

export const SaleStatus = PrismaSaleStatus;
export type SaleStatus = PrismaSaleStatus;

export type Sale = PrismaSale;
