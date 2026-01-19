import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateProductParams,
  GetProductsParams,
  UpdateProductParams,
} from '../models/catalog.types';
import { Product } from '../models/product.model';
import { ProductRepository } from '../../infrastructure/persistence/product.repository';
import { PaginatedResult } from 'src/common/models/paginated-result.interface';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(productData: CreateProductParams): Promise<Product> {
    // Verify products that already exists
    return await this.productRepository.create(productData);
  }

  async update(
    productId: number,
    productData: UpdateProductParams,
  ): Promise<Product> {
    const productToUpdate = await this.productRepository.findOne(productId);

    if (!productToUpdate) {
      throw new NotFoundException('Produto não encontrado');
    }

    return await this.productRepository.update(productId, productData);
  }

  async findOne(productId: number): Promise<Product> {
    const product = await this.productRepository.findOne(productId);

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return product;
  }

  async findAll(
    getProductParams: GetProductsParams,
  ): Promise<PaginatedResult<Product>> {
    const result = await this.productRepository.findAll(getProductParams);

    return {
      data: result.data,
      meta: result.meta,
    };
  }

  async delete(productId: number): Promise<Product> {
    const productToDelete = await this.productRepository.findOne(productId);

    if (!productToDelete) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (productToDelete.deleted_at) {
      throw new HttpException(
        'Produto já está excluído',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.productRepository.softDelete(productId);
  }

  async restore(productId: number): Promise<Product> {
    const productToRestore = await this.productRepository.findOne(productId);

    if (!productToRestore) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (!productToRestore.deleted_at) {
      throw new HttpException(
        'Produto já está habilitado',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.productRepository.restore(productId);
  }

  async increaseStock(productId: number, quantity: number): Promise<void> {
    await this.productRepository.updateStock(productId, quantity, 'increment');
  }

  async decreaseStock(productId: number, quantity: number): Promise<void> {
    await this.productRepository.updateStock(productId, quantity, 'decrement');
  }

  async syncStock(productId: number, quantity: number): Promise<void> {
    await this.productRepository.setStock(productId, quantity);
  }
}
