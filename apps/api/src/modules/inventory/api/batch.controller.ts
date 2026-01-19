import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BatchService } from '../core/services/batch.service';
import { CreateBatchDto } from './dtos/create-batch.dto';
import { UpdateBatchDto } from './dtos/update-batch.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { GetBatchesDto } from './dtos/get-batches.dto';

@Controller('batches')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Post()
  @ResponseMessage('Lote criado com sucesso.')
  async create(@Body() createBatchDto: CreateBatchDto) {
    return await this.batchService.create(createBatchDto);
  }

  @Patch('/:id')
  @ResponseMessage('Lote atualizado com sucesso.')
  async update(
    @Param('id', ParseIntPipe) batchId: number,
    @Body() updateBatchDto: UpdateBatchDto,
  ) {
    return await this.batchService.update(batchId, updateBatchDto);
  }

  @Get('/:id')
  async getOne(@Param('id', ParseIntPipe) batchId: number) {
    return await this.batchService.findOne(batchId);
  }

  @Get('/product/:productId')
  async getAllByProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Query() getBatchesByProductDto: GetBatchesDto,
  ) {
    return await this.batchService.findAllByProduct(
      productId,
      getBatchesByProductDto,
    );
  }

  @Get()
  async getAll(@Query() getBatchesByProductDto: GetBatchesDto) {
    return await this.batchService.findAll(getBatchesByProductDto);
  }

  @Delete('/:id')
  @ResponseMessage('Lote deletado com sucesso.')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) batchId: number) {
    await this.batchService.delete(batchId);
  }

  @Patch('/:productId/sync')
  @ResponseMessage('Estoque do produto sincronizado com sucesso.')
  async syncStockByProduct(
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return await this.batchService.syncStockByProduct(productId);
  }
}
