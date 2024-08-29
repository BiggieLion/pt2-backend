import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRequestDto {
  @IsNumber()
  requester_id: number;

  @IsNumber()
  analyst_id: number;

  @IsNumber()
  supervisor_id: number;

  @IsNumber()
  credit_id: number;

  @IsString()
  @IsOptional()
  url_ine: string;

  @IsString()
  @IsOptional()
  url_birth_certificate: string;

  @IsString()
  @IsOptional()
  url_address: string;

  @IsBoolean()
  is_approved: boolean;
}
