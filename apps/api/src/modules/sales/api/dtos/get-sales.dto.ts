import { GetSalesSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export class GetSalesDto extends createZodDto(GetSalesSchema) {}
