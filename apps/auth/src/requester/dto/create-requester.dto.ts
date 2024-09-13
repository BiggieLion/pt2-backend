import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

export class CreateRequesterDto {
  @IsString()
  @IsNotEmpty()
  @Length(18, 18, { message: 'CURP must be 18 characters length' })
  curp: string;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsString()
  @IsNotEmpty()
  @Length(13, 13, { message: 'RFC must be 13 characters length' })
  rfc: string;

  @IsNumber()
  @IsNotEmpty()
  monthly_income: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsNumber()
  @IsNotEmpty()
  count_children: number;

  @IsNumber()
  @IsNotEmpty()
  count_adults: number;

  @IsNumber()
  @IsNotEmpty()
  count_family_members: number;

  @IsString()
  @IsNotEmpty()
  civil_status: string;

  @IsString()
  @IsNotEmpty()
  education_level: string;

  @IsNumber()
  @IsNotEmpty()
  days_employed: number;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  birthdate: Date;

  @IsBoolean()
  @IsNotEmpty()
  has_own_car: boolean;

  @IsBoolean()
  @IsNotEmpty()
  has_own_realty: boolean;
}