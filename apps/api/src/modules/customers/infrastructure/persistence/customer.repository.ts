import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/persistence/prisma.service';
import { Prisma } from '@prisma/client';
import {
  Customer,
  CustomerStatusFilter,
} from '../../core/models/customer.model';
import { GetCustomersParams } from '../../core/models/customers.types';
import { PaginatedResult } from 'src/common/models/paginated-result.interface';

@Injectable()
export class CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.CustomerCreateInput): Promise<Customer> {
    return await this.prisma.customer.create({ data });
  }

  async update(
    id: number,
    data: Prisma.CustomerUpdateInput,
  ): Promise<Customer> {
    return await this.prisma.customer.update({
      where: { id },
      data,
    });
  }

  async findOne(id: number): Promise<Customer | null> {
    return await this.prisma.customer.findUnique({
      where: { id },
    });
  }

  async findAll(
    params: GetCustomersParams,
  ): Promise<PaginatedResult<Customer>> {
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
          name: {
            contains: search,
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
      data,
      meta: {
        total,
        page,
        limit,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  async softDelete(id: number): Promise<Customer> {
    return await this.prisma.customer.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async restore(id: number): Promise<Customer> {
    return await this.prisma.customer.update({
      where: { id },
      data: {
        deleted_at: null,
      },
    });
  }
}
