import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SaleService } from '../core/services/sale.service';
import { CreateSaleDto } from './dtos/create-sale.dto';
import { CompleteSale, Sale, SaleWithItems } from '../core/models/sale.model';
import { UpdateSaleDto } from './dtos/update-sale.dto';
import { GetSalesDto } from './dtos/get-sales.dto';
import { PaginatedResult } from '@repo/types';
import { SalesReportResponse } from '../core/models/sales.types';
import { GetSalesReportDto } from './dtos/get-sales-report.dto';

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
  async getAll(
    @Query() getSalesDto: GetSalesDto,
  ): Promise<PaginatedResult<Sale>> {
    return await this.saleService.findAll(getSalesDto);
  }

  @Get('/dashboard/report')
  async getReport(
    @Query() getSalesReportDto: GetSalesReportDto,
  ): Promise<SalesReportResponse> {
    return await this.saleService.generateReport(getSalesReportDto);
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
