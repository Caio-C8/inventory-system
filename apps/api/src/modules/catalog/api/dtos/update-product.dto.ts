import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProductDto {
  @IsString({ message: 'Nome inválido.' })
  @IsOptional()
  name?: string;

  @IsString({ message: 'Código inválido.' })
  @IsOptional()
  code?: string;

  @IsString({ message: 'Código de barras inválido.' })
  @IsOptional()
  barcode?: string;

  @Min(0.01, { message: 'Preço não pode ser 0.' })
  @IsNumber({}, { message: 'Preço inválido.' })
  @IsOptional()
  sale_price?: number;
}
