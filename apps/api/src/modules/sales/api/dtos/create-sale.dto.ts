import { CreateSaleSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export class CreateSaleDto extends createZodDto(CreateSaleSchema) {}
