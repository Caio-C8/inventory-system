import { Body, Controller, Get, Post } from '@nestjs/common';
import { SaleService } from '../core/services/sale.service';
import { CreateSaleDto } from './dtos/create-sale.dto';

@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  async create(@Body() createSaleDto: CreateSaleDto) {
    return this.saleService.create(createSaleDto);
  }
}
