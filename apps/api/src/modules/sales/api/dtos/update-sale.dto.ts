import {
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { SaleStatus } from '../../core/models/sale.model';
import { Type } from 'class-transformer';

export class UpdateSaleDto {
  @IsNumber({}, { message: 'Valor total inválido.' })
  @Min(0.01, { message: 'O valor total deve ser maior que 0.' })
  @Type(() => Number)
  @IsOptional()
  total_value?: number = 0;

  @IsString({ message: 'Forma da venda inválida.' })
  @IsOptional()
  channel?: string;

  @IsDate({ message: 'Data de venda inválida.' })
  @Type(() => Date)
  @IsOptional()
  sale_date?: Date;

  @IsEnum(SaleStatus)
  @IsOptional()
  status?: SaleStatus;

  @IsInt({ message: 'ID do cliente inválido.' })
  @Min(1, { message: 'Informe um ID de cliente válido.' })
  @Type(() => Number)
  @IsOptional()
  customer_id?: number;
}
