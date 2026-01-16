import { Product as PrismaProduct, Batch as PrismaBatch } from '@prisma/client';

export type Product = PrismaProduct & {
  batches?: PrismaBatch[];
};

export enum ProductStatusFilter {
  ACTIVE = 'active',
  DELETED = 'deleted',
  ALL = 'all',
}
