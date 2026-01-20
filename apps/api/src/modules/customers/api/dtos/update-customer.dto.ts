import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateCustomerDto {
  @IsString({ message: 'Nome inválido.' })
  @IsOptional()
  name?: string;

  @IsDate({ message: 'Data de aniversário inválida.' })
  @Type(() => Date)
  @IsOptional()
  birth_date?: Date;

  @IsString({ message: 'Contato inválido.' })
  @IsOptional()
  contact_info?: string;
}
