import { CreateBatchSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export class CreateBatchDto extends createZodDto(CreateBatchSchema) {}
