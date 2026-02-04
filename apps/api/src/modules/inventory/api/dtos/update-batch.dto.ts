import { UpdateBatchSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export class UpdateBatchDto extends createZodDto(UpdateBatchSchema) {}
