import { createZodDto } from 'nestjs-zod';
import { GetSalesForReportSchema } from '@repo/types';

export class GetSalesReportDto extends createZodDto(GetSalesForReportSchema) {}
