import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductService } from '../core/services/product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductWithStock } from '../core/models/product.model';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ResponseMessage('Produto criado com sucesso')
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductWithStock> {
    return await this.productService.create(createProductDto);
  }

  @Patch('/:id')
  @ResponseMessage('Produto alterado com sucesso')
  async update(
    @Param('id', ParseIntPipe) productId: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductWithStock> {
    return await this.productService.update(productId, updateProductDto);
  }

  @Get('/:id')
  async getOne(
    @Param('id', ParseIntPipe) productId: number,
  ): Promise<ProductWithStock> {
    return this.productService.findOne(productId);
  }

  @Get()
  async getAll(): Promise<ProductWithStock[]> {
    return this.productService.findAll();
  }

  @Delete('/:id')
  @ResponseMessage('Produto removido com sucesso')
  async delete(@Param('id', ParseIntPipe) productId: number) {
    return this.productService.delete(productId);
  }

  @Patch('/:id/restore')
  @ResponseMessage('Produto restaurado com sucesso')
  async restore(@Param('id', ParseIntPipe) productId: number) {
    return this.productService.restore(productId);
  }
}
