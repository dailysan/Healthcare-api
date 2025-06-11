import { IsString, IsNotEmpty, IsEmail, IsOptional, IsPositive, Length, IsNumber } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 20)
  phone: string;

  @IsNumber()
  @IsNotEmpty()
  clinicId: number;
}
