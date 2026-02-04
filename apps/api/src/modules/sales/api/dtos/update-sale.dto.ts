import { UpdateSaleSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export class UpdateSaleDto extends createZodDto(UpdateSaleSchema) {}
