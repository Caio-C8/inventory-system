import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { SaleStatus } from '../../core/models/sale.model';
import { Type } from 'class-transformer';

export class UpdateSaleDto {
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
