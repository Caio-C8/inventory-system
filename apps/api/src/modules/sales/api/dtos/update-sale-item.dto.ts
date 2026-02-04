import { UpdateSaleItemSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export class UpdateSaleItemDto extends createZodDto(UpdateSaleItemSchema) {}
