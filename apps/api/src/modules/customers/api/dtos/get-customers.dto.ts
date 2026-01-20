import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CustomerStatusFilter } from '../../core/models/customer.model';

export class GetCustomersDto extends PaginationDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsOptional()
  @IsEnum(CustomerStatusFilter)
  status?: CustomerStatusFilter = CustomerStatusFilter.ACTIVE;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  min_birth_date?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  max_birth_date?: Date;
}
