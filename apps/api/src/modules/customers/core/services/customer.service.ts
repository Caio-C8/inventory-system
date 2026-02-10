import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CustomerRepository } from '../../infrastructure/persistence/customer.repository';
import {
  CreateCustomerInput,
  UpdateCustomerInput,
  GetCustomersInput,
} from '../models/customers.types';
import { Customer } from '../models/customer.model';
import { PaginatedResult } from '@repo/types';
import { normalizeString } from '@repo/utils';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async create(customerData: CreateCustomerInput): Promise<Customer> {
    return await this.customerRepository.create({
      ...customerData,
      name_search: normalizeString(customerData.name),
    });
  }

  async update(
    customerId: number,
    customerData: UpdateCustomerInput,
  ): Promise<Customer> {
    if (Object.keys(customerData).length === 0) {
      throw new BadRequestException('Nenhum dado fornecido para atualização.');
    }

    const customer = await this.customerRepository.findOne(customerId);

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado.');
    }

    return await this.customerRepository.update(customerId, {
      ...customerData,
      name_search: customerData.name
        ? normalizeString(customerData.name)
        : undefined,
    });
  }

  async findOne(customerId: number): Promise<Customer | null> {
    const customer = await this.customerRepository.findOne(customerId);

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado.');
    }

    return customer;
  }

  async findAll(
    getCustomersParams: GetCustomersInput,
  ): Promise<PaginatedResult<Customer>> {
    const result = await this.customerRepository.findAll(getCustomersParams);

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
