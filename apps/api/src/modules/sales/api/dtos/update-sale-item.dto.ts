import { IsInt, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class UpdateSaleItemDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  product_id?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  unit_sale_price?: number;
}
