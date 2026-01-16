import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateProductParams,
  ProductWithStock,
  UpdateProductParams,
} from '../models/product.model';
import { ProductRepository } from '../../infrastructure/persistence/product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(productData: CreateProductParams): Promise<ProductWithStock> {
    const product = await this.productRepository.create(productData);

    return { total_quantity: 0, ...product };
  }

  async update(
    productId: number,
    productData: UpdateProductParams,
  ): Promise<ProductWithStock> {
    const productToUpdate = await this.productRepository.findOne(productId);

    if (!productToUpdate) {
      throw new NotFoundException('Produto não encontrado');
    }

    const product = await this.productRepository.update(productId, productData);

    return this.calculateTotalStockQuantity(product);
  }

  async findOne(productId: number): Promise<ProductWithStock> {
    const product = await this.productRepository.findOne(productId);

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return this.calculateTotalStockQuantity(product);
  }

  async findAll(): Promise<ProductWithStock[]> {
    const products = await this.productRepository.findAll();

    return products.map((product) => this.calculateTotalStockQuantity(product));
  }

  async delete(productId: number) {
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

    const product = await this.productRepository.softDelete(productId);

    return this.calculateTotalStockQuantity(product);
  }

  async restore(productId: number) {
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

    const product = await this.productRepository.restore(productId);

    return this.calculateTotalStockQuantity(product);
  }

  //Private methods
  private calculateTotalStockQuantity(product: any): ProductWithStock {
    const totalQuantity =
      product.batches?.reduce(
        (acc: number, batch: any) => acc + batch.current_quantity,
        0,
      ) || 0;

    return { total_quantity: totalQuantity, ...product };
  }
}
