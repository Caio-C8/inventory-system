import { UpdateCustomerSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export class UpdateCustomerDto extends createZodDto(UpdateCustomerSchema) {}
