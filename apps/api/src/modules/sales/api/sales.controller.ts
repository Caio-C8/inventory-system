import { Body, Controller, Get, Post } from '@nestjs/common';
import { SaleService } from '../core/services/sale.service';
import { CreateSaleDto } from './dtos/create-sale.dto';
import { Sale } from '../core/models/sale.model';

@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  async create(@Body() createSaleDto: CreateSaleDto): Promise<Sale> {
    return this.saleService.create(createSaleDto);
  }
}
