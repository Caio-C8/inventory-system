import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Get,
  Delete,
  Query,
} from '@nestjs/common';
import { CustomerService } from '../core/services/customer.service';
import { Customer } from '../core/models/customer.model';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { GetCustomersDto } from './dtos/get-customers.dto';
import { PaginatedResult } from 'src/common/models/paginated-result.interface';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @ResponseMessage('Cliente criado com sucesso.')
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    return this.customerService.create(createCustomerDto);
  }

  @Patch('/:id')
  @ResponseMessage('Cliente atualizado com sucesso.')
  async update(
    @Param('id', ParseIntPipe) customerId: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return await this.customerService.update(customerId, updateCustomerDto);
  }

  @Get('/:id')
  async getOne(
    @Param('id', ParseIntPipe) customerId: number,
  ): Promise<Customer | null> {
    return await this.customerService.findOne(customerId);
  }

  @Get()
  async getAll(
    @Query() getCustomersDto: GetCustomersDto,
  ): Promise<PaginatedResult<Customer>> {
    return await this.customerService.findAll(getCustomersDto);
  }

  @Delete('/:id')
  @ResponseMessage('Cliente deletado com sucesso.')
  async delete(
    @Param('id', ParseIntPipe) customerId: number,
  ): Promise<Customer> {
    return this.customerService.delete(customerId);
  }

  @Patch('/:id/restore')
  @ResponseMessage('Cliente restaurado com sucesso.')
  async restore(
    @Param('id', ParseIntPipe) customerId: number,
  ): Promise<Customer> {
    return this.customerService.restore(customerId);
  }
}
