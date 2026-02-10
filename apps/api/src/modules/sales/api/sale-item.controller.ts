import {
  Controller,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { SaleItemService } from '../core/services/sale-item.service';
import { UpdateSaleItemDto } from './dtos/update-sale-item.dto';
import { SaleWithItems } from '../core/models/sale.model';

@Controller('sales/items')
export class SaleItemController {
  constructor(private readonly saleItemService: SaleItemService) {}

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSaleItemDto,
  ): Promise<SaleWithItems> {
    return await this.saleItemService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<SaleWithItems> {
    return await this.saleItemService.delete(id);
  }
}
