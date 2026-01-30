import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { SaleStatus } from '../../core/models/sale.model';
import { Type } from 'class-transformer';

export class GetSalesDto extends PaginationDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(SaleStatus)
  @IsOptional()
  status?: SaleStatus = SaleStatus.COMPLETED;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  min_sale_date?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  max_sale_date?: Date;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  min_total_value?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  max_total_value?: number;

  @IsString()
  @IsOptional()
  channel?: string;
}
