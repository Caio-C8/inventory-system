import { IsDate, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetSalesReportDto {
  @Type(() => Date)
  @IsDate()
  start_date!: Date;

  @Type(() => Date)
  @IsDate()
  end_date!: Date;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.toUpperCase())
  channel?: string;
}
