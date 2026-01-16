import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ProductStatusFilter } from '../../core/models/product.model';
import { Type } from 'class-transformer';

export class GetProductsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ProductStatusFilter)
  status?: ProductStatusFilter = ProductStatusFilter.ACTIVE;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  min_price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  max_price?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  min_stock?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  max_stock?: number;
}
