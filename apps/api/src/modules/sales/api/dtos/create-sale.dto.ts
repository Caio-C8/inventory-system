import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { SaleStatus } from '../../core/models/sale.model';
import { Type } from 'class-transformer';

export class CreateItemSaleDto {
  @IsInt({ message: 'ID do produto inválido.' })
  @Min(1, { message: 'Informe um ID de produto válido.' })
  @Type(() => Number)
  @IsNotEmpty({ message: 'Selecione um produto.' })
  product_id!: number;

  @IsInt()
  @Min(1, { message: 'A quantidade deve ser maior do que 0.' })
  @IsNotEmpty({ message: 'Preencha o campo quantidade.' })
  quantity!: number;

  @IsNumber({}, { message: 'Preço de venda inválido.' })
  @Min(0.01, { message: 'O preço de venda deve ser maior que 0.' })
  @Type(() => Number)
  @IsNotEmpty({ message: 'Preencha o campo preço de venda unitário.' })
  unit_sale_price!: number;
}

export class CreateSaleDto {
  @IsNumber({}, { message: 'Valor total inválido.' })
  @Min(0.01, { message: 'O valor total deve ser maior que 0.' })
  @Type(() => Number)
  @IsOptional()
  total_value?: number = 0;

  @IsString({ message: 'Forma da venda inválida.' })
  @IsNotEmpty({ message: 'Preencha o campo forma de venda.' })
  channel!: string;

  @IsDate({ message: 'Data de venda inválida.' })
  @Type(() => Date)
  @IsNotEmpty({ message: 'Preencha o campo data de venda.' })
  sale_date!: Date;

  @IsEnum(SaleStatus)
  status!: SaleStatus;

  @IsInt({ message: 'ID do cliente inválido.' })
  @Min(1, { message: 'Informe um ID de cliente válido.' })
  @Type(() => Number)
  @IsNotEmpty({ message: 'Selecione um cliente.' })
  customer_id!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemSaleDto)
  itemsSale!: CreateItemSaleDto[];
}
