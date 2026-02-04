import { createZodDto } from 'nestjs-zod';
import { GetProductsSchema } from '@repo/types';

export class GetProductsDto extends createZodDto(GetProductsSchema) {}
