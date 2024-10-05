import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRequestDto {
  @IsString()
  @IsOptional()
  requester_id: string;

  @IsString()
  @IsOptional()
  analyst_id: string;

  @IsString()
  @IsOptional()
  supervisor_id: string;

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
