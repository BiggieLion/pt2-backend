import {
  IsArray,
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
  credit_type: number; // 1->Personal, 2->House, 3->Warrant

  @IsString()
  @IsOptional()
  url_ine: string;

  @IsString()
  @IsOptional()
  url_birth_certificate: string;

  @IsString()
  @IsOptional()
  url_address: string;

  @IsNumber()
  @IsOptional()
  status: number; // 1 -> Created, 2 -> Under revision, 3 -> Approved, 4- -> Rejected

  @IsNumber()
  @IsNotEmpty()
  loan_term: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @IsOptional()
  guarantee_type: number;

  @IsNumber()
  @IsOptional()
  guarantee_value: number;

  @IsArray()
  @IsOptional()
  chat: object[];
}
