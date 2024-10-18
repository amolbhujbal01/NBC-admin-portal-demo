import { IsOptional, IsString } from 'class-validator';

export class TenantSearchDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
