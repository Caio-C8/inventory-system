import { CreateCustomerSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export class CreateCustomerDto extends createZodDto(CreateCustomerSchema) {}
