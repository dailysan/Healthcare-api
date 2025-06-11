import { IsString, IsNotEmpty, IsDecimal, IsOptional, IsBoolean } from 'class-validator';

export class CreateOhipCodeDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDecimal()
  @IsNotEmpty()
  basePrice: number;

  @IsDecimal()
  @IsOptional()
  maxPrice?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
