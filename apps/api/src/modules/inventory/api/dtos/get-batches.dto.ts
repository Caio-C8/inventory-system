import { GetBatchesSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export class GetBatchesDto extends createZodDto(GetBatchesSchema) {}
