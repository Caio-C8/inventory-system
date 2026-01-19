import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateBatchDto {
  @IsString({ message: 'Número da nota fiscal inválida' })
  @IsNotEmpty({ message: 'Preencha o campo número da nota fiscal' })
  tax_invoice_number!: string;

  @IsNumber({}, { message: 'Preço de custo inválido' })
  @Min(0.01, { message: 'O preço de custo deve ser maior que 0' })
  @Type(() => Number)
  @IsNotEmpty({ message: 'Preencha o campo preço de custo unitário' })
  unit_cost_price!: number;

  @IsDate({ message: 'Data de validade inválida' })
  @Type(() => Date)
  @IsNotEmpty({ message: 'Preencha o campo data de validade' })
  expiration_date!: Date;

  @IsDate({ message: 'Data de compra inválida' })
  @Type(() => Date)
  @IsNotEmpty({ message: 'Preencha o campo data de compra' })
  purchase_date!: Date;

  @IsInt()
  @Min(1, { message: 'A quantidade comprada deve ser maior do que 0' })
  @IsNotEmpty({ message: 'Preencha o campo quantidade comprada' })
  purchase_quantity!: number;

  @IsInt({ message: 'ID do produto inválido' })
  @Min(1, { message: 'Informe um ID de produto válido' })
  @Type(() => Number)
  @IsNotEmpty({ message: 'Selecione um produto' })
  product_id!: number;
}
