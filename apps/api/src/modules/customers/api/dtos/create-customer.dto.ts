import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsString({ message: 'Nome inválido.' })
  @IsNotEmpty({ message: 'Preencha o campo nome.' })
  name!: string;

  @IsDate({ message: 'Data de aniversário inválida.' })
  @Type(() => Date)
  @IsOptional()
  birth_date?: Date;

  @IsString({ message: 'Contato inválido.' })
  @IsOptional()
  contact_info?: string;
}
