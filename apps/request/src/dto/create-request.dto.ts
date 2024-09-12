import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRequestDto {
  @IsNumber()
  @IsNotEmpty()
  requester_id: number;

  @IsNumber()
  @IsNotEmpty()
  analyst_id: number;

  @IsNumber()
  @IsNotEmpty()
  supervisor_id: number;

  @IsNumber()
  @IsNotEmpty()
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
