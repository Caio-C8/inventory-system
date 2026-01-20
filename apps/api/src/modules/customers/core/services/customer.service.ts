import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CustomerRepository } from '../../infrastructure/persistence/customer.repository';
import {
  CreateCustomerParams,
  UpdateCustomerParams,
} from '../models/customers.types';
import { Customer } from '../models/customer.model';
import { GetCustomersParams } from '../models/customers.types';
import { PaginatedResult } from 'src/common/models/paginated-result.interface';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async create(customerData: CreateCustomerParams): Promise<Customer> {
    return await this.customerRepository.create(customerData);
  }

  async update(
    customerId: number,
    customerData: UpdateCustomerParams,
  ): Promise<Customer> {
    const customer = await this.customerRepository.findOne(customerId);

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado.');
    }

    return await this.customerRepository.update(customerId, customerData);
  }

  async findOne(customerId: number): Promise<Customer | null> {
    return await this.customerRepository.findOne(customerId);
  }

  async findAll(
    getProductParams: GetCustomersParams,
  ): Promise<PaginatedResult<Customer>> {
    const result = await this.customerRepository.findAll(getProductParams);

    return {
      data: result.data,
      meta: result.meta,
    };
  }

  async delete(customerId: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne(customerId);

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado.');
    }

    if (customer.deleted_at) {
      throw new BadRequestException('Cliente já está excluído');
    }

    return this.customerRepository.softDelete(customerId);
  }

  async restore(customerId: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne(customerId);

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado.');
    }

    if (!customer.deleted_at) {
      throw new BadRequestException('Cliente já está habilitado');
    }

    return this.customerRepository.restore(customerId);
  }
}
