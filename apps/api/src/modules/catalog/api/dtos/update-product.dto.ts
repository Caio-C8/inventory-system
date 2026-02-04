import { UpdateProductSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export class UpdateProductDto extends createZodDto(UpdateProductSchema) {}
