import { IsNumber, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GenerateInvoiceDto {
  @IsNumber()
  @IsNotEmpty()
  billingSessionId: number;

  @IsNumber()
  @IsNotEmpty()
  basePrice: number;

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
