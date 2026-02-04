import { GetCustomersSchema } from '@repo/types';
import { createZodDto } from 'nestjs-zod';

export class GetCustomersDto extends createZodDto(GetCustomersSchema) {}
