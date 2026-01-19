import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class GetBatchesDto extends PaginationDto {
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  min_expiration_date?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  max_expiration_date?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  min_purchase_date?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  max_purchase_date?: Date;

  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  @IsOptional()
  min_unit_cost_price?: number;

  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  @IsOptional()
  max_unit_cost_price?: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  min_current_quantity?: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  max_current_quantity?: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  min_purchase_quantity?: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  max_purchase_quantity?: number;
}
