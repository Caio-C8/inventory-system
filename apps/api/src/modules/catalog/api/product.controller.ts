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
import { ProductService } from '../core/services/product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Product } from '../core/models/product.model';
import { PaginatedResult } from 'src/common/models/paginated-result.interface';
import { GetProductsDto } from './dtos/get-products.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ResponseMessage('Produto criado com sucesso')
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return await this.productService.create(createProductDto);
  }

  @Patch('/:id')
  @ResponseMessage('Produto alterado com sucesso')
  async update(
    @Param('id', ParseIntPipe) productId: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return await this.productService.update(productId, updateProductDto);
  }

  @Get('/:id')
  async getOne(@Param('id', ParseIntPipe) productId: number): Promise<Product> {
    return this.productService.findOne(productId);
  }

  @Get()
  async getAll(
    @Query() getProductsDto: GetProductsDto,
  ): Promise<PaginatedResult<Product>> {
    return this.productService.findAll(getProductsDto);
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
