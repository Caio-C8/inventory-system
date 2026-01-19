import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateBatchDto {
  @IsString({ message: 'Número da nota fiscal inválida.' })
  @IsOptional()
  tax_invoice_number?: string;

  @IsNumber({}, { message: 'Preço de custo inválido.' })
  @Min(0.01, { message: 'O preço de custo deve ser maior que 0.' })
  @Type(() => Number)
  @IsOptional()
  unit_cost_price?: number;

  @IsDate({ message: 'Data de validade inválida.' })
  @Type(() => Date)
  @IsOptional()
  expiration_date?: Date;

  @IsDate({ message: 'Data de compra inválida.' })
  @Type(() => Date)
  @IsOptional()
  purchase_date?: Date;

  @IsInt()
  @Min(0, { message: 'A quantidade atual não pode ser menor do que 0.' })
  @IsOptional()
  current_quantity?: number;

  @IsInt()
  @Min(1, { message: 'A quantidade comprada deve ser maior do que 0.' })
  @IsOptional()
  purchase_quantity?: number;

  @IsInt({ message: 'ID do produto inválido.' })
  @Min(1, { message: 'Informe um ID de produto válido.' })
  @Type(() => Number)
  @IsOptional()
  product_id?: number;
}
