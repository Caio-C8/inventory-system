import { Module } from '@nestjs/common';
import { CustomerController } from './api/customer.controller';
import { CustomerService } from './core/services/customer.service';
import { CustomerRepository } from './infrastructure/persistence/customer.repository';
import { PrismaService } from 'src/common/persistence/prisma.service';

@Module({
  imports: [],
  controllers: [CustomerController],
  providers: [CustomerService, CustomerRepository, PrismaService],
  exports: [CustomerService],
})
export class CustomersModule {}
