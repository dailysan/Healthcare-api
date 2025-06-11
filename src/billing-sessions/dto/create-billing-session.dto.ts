import { IsNumber, IsNotEmpty, IsArray, IsObject } from 'class-validator';

export class CreateBillingSessionDto {
  @IsNumber()
  @IsNotEmpty()
  patientId: number;

  @IsNumber()
  @IsNotEmpty()
  clinicId: number;

  @IsNumber()
  @IsNotEmpty()
  total: number;

  @IsArray()
  @IsObject({ each: true })
  services: any[];
}
