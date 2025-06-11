import { IsNumber, IsNotEmpty, Min, Max, IsString, IsPositive, Length } from 'class-validator';

export class CreatePricingRuleDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  percentage: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  clinicId: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  ohipCodeId: string;
}
