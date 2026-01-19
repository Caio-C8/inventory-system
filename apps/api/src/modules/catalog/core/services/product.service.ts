import {
  BadRequestException,
  ConflictException,
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
    const conflicts = await this.findConflicts(productData);

    if (conflicts.length > 0) {
      this.identifyConflicts(conflicts, productData);
    }

    return await this.productRepository.create(productData);
  }

  async update(
    productId: number,
    productData: UpdateProductParams,
  ): Promise<Product> {
    if (Object.keys(productData).length === 0) {
      throw new BadRequestException('Nenhum dado fornecido para atualização.');
    }

    const productToUpdate = await this.productRepository.findOne(productId);

    if (!productToUpdate) {
      throw new NotFoundException('Produto não encontrado.');
    }

    const potentialConflicts = await this.findConflicts(productData);

    const realConflicts = potentialConflicts.filter(
      (product) => product.id !== productId,
    );

    if (realConflicts.length > 0) {
      this.identifyConflicts(realConflicts, productData);
    }

    return await this.productRepository.update(productId, productData);
  }

  async findOne(productId: number): Promise<Product> {
    const product = await this.productRepository.findOne(productId);

    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
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
      throw new NotFoundException('Produto não encontrado.');
    }

    if (productToDelete.deleted_at) {
      throw new BadRequestException('Produto já está excluído.');
    }

    return await this.productRepository.softDelete(productId);
  }

  async restore(productId: number): Promise<Product> {
    const productToRestore = await this.productRepository.findOne(productId);

    if (!productToRestore) {
      throw new NotFoundException('Produto não encontrado.');
    }

    if (!productToRestore.deleted_at) {
      throw new BadRequestException('Produto já está habilitado.');
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

  private async findConflicts(
    data: CreateProductParams | UpdateProductParams,
  ): Promise<Product[]> {
    const orConditions = [];

    if (data.name) {
      orConditions.push({ name: { equals: data.name as string } });
    }

    if (data.code) {
      orConditions.push({ code: { equals: data.code as string } });
    }

    if (data.barcode) {
      orConditions.push({ barcode: { equals: data.barcode as string } });
    }

    if (orConditions.length === 0) {
      return [];
    }

    return await this.productRepository.findConflicts(orConditions);
  }

  private identifyConflicts(
    conflicts: Product[],
    data: CreateProductParams | UpdateProductParams,
  ): void {
    const errors: { field: string; message: string }[] = [];

    conflicts.forEach((product) => {
      if (product.name === data.name) {
        errors.push({
          field: 'name',
          message: 'Já existe um produto com este nome.',
        });
      }

      if (product.code === data.code) {
        errors.push({
          field: 'code',
          message: 'Já existe um produto com este código.',
        });
      }

      if (product.barcode === data.barcode) {
        errors.push({
          field: 'barcode',
          message: 'Já existe um produto com este código de barras.',
        });
      }
    });

    if (errors.length > 0) {
      throw new ConflictException({
        message: 'Erro de validação nos dados enviados.',
        errors: errors,
      });
    }
  }
}
