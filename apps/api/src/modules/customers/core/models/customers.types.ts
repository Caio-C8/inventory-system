import { CustomerStatusFilter } from './customer.model';

export interface CreateCustomerParams {
  name: string;
  birth_date?: Date;
  contact_info?: string;
}

export interface UpdateCustomerParams {
  name?: string;
  birth_date?: Date;
  contact_info?: string;
}

export interface GetCustomersParams {
  page: number;
  limit: number;
  search?: string;
  status?: CustomerStatusFilter;
  min_birth_date?: Date;
  max_birth_date?: Date;
}
