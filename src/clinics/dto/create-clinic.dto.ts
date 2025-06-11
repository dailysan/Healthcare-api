import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateClinicDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsOptional()
  settings?: any;
}
