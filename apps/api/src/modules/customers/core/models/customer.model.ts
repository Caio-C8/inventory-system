import { Customer as PrismaCustomer } from '@prisma/client';

export type Customer = PrismaCustomer;

export enum CustomerStatusFilter {
  ACTIVE = 'active',
  DELETED = 'deleted',
  ALL = 'all',
}
