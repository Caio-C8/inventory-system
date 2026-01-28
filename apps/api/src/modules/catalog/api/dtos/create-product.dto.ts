import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'Nome inválido.' })
  @IsNotEmpty({ message: 'Preencha o campo nome.' })
  name!: string;

  @IsString({ message: 'Código inválido.' })
  @IsNotEmpty({ message: 'Preencha o campo código.' })
  code!: string;

  @IsString({ message: 'Código de barras inválido.' })
  @IsNotEmpty({ message: 'Preencha o campo código de barras.' })
  barcode!: string;

  @Min(0.01, { message: 'Preço não pode ser 0.' })
  @IsNumber({}, { message: 'Preço inválido.' })
  @Type(() => Number)
  @IsNotEmpty({ message: 'Preencha o campo preço de venda.' })
  sale_price!: number;
}
