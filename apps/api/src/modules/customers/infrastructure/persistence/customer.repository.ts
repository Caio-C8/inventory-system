import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/persistence/prisma.service';
import { Prisma } from '@prisma/client';
import {
  Customer,
  CustomerStatusFilter,
} from '../../core/models/customer.model';
import {
  GetCustomersInput,
  CreateCustomerInput,
  UpdateCustomerInput,
} from '../../core/models/customers.types';
import { PaginatedResult } from '@repo/types';
import { normalizeString } from '@repo/utils';

@Injectable()
export class CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCustomerInput): Promise<Customer> {
    const customer = await this.prisma.customer.create({ data });

    return this.mapToCustomer(customer);
  }

  async update(id: number, data: UpdateCustomerInput): Promise<Customer> {
    const customer = await this.prisma.customer.update({
      where: { id },
      data,
    });

    return this.mapToCustomer(customer);
  }

  async findOne(id: number): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    return customer ? this.mapToCustomer(customer) : null;
  }

  async findAll(params: GetCustomersInput): Promise<PaginatedResult<Customer>> {
    const { page, limit, search, status, min_birth_date, max_birth_date } =
      params;

    const skip = (page - 1) * limit;

    const where: Prisma.CustomerWhereInput = {
      deleted_at:
        status === CustomerStatusFilter.ACTIVE
          ? null
          : status === CustomerStatusFilter.DELETED
            ? { not: null }
            : undefined,
    };

    if (search) {
      where.OR = [
        {
          name_search: {
            contains: normalizeString(search),
          },
        },
      ];

      if (!isNaN(Number(search))) {
        where.OR.push({ id: Number(search) });
      }
    }

    if (min_birth_date || max_birth_date) {
      where.birth_date = {
        gte: min_birth_date,
        lte: max_birth_date,
      };
    }

    const [total, data] = await this.prisma.$transaction([
      this.prisma.customer.count({ where }),
      this.prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
    ]);

    return {
      data: data.map((customer) => this.mapToCustomer(customer)),
      meta: {
        total,
        page,
        limit,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  async softDelete(id: number): Promise<Customer> {
    const customer = await this.prisma.customer.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });

    return this.mapToCustomer(customer);
  }

  async restore(id: number): Promise<Customer> {
    const customer = await this.prisma.customer.update({
      where: { id },
      data: {
        deleted_at: null,
      },
    });

    return this.mapToCustomer(customer);
  }

  private mapToCustomer(prismaCustomer: any): Customer {
    return {
      id: prismaCustomer.id,
      name: prismaCustomer.name,
      name_search: prismaCustomer.name_search,
      birth_date: prismaCustomer.birth_date ?? undefined,
      contact_info: prismaCustomer.contact_info ?? undefined,
      deleted_at: prismaCustomer.deleted_at ?? undefined,
    };
  }
}
