import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { SaleService } from '../core/services/sale.service';
import { CreateSaleDto } from './dtos/create-sale.dto';
import { CompleteSale, Sale, SaleWithItems } from '../core/models/sale.model';
import { UpdateSaleDto } from './dtos/update-sale.dto';

@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  async create(@Body() createSaleDto: CreateSaleDto): Promise<Sale> {
    return await this.saleService.create(createSaleDto);
  }

  @Patch('/:id')
  async update(
    @Param('id', ParseIntPipe) saleId: number,
    @Body() updateSaleDto: UpdateSaleDto,
  ): Promise<CompleteSale | SaleWithItems> {
    return await this.saleService.update(saleId, updateSaleDto);
  }

  @Get('/:id')
  async getOne(
    @Param('id', ParseIntPipe) saleId: number,
  ): Promise<CompleteSale | SaleWithItems> {
    return await this.saleService.findOne(saleId);
  }

  @Get()
  async getAll(): Promise<CompleteSale[] | SaleWithItems[]> {
    return await this.saleService.findAll();
  }

  @Patch('/:id/cancel')
  async cancel(
    @Param('id', ParseIntPipe) saleId: number,
  ): Promise<CompleteSale | SaleWithItems> {
    return await this.saleService.cancel(saleId);
  }

  @Patch('/:id/restore')
  async restore(
    @Param('id', ParseIntPipe) saleId: number,
  ): Promise<CompleteSale | SaleWithItems> {
    return await this.saleService.restore(saleId);
  }
}
