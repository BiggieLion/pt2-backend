import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateStaffDto {
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsInt()
  @IsNotEmpty()
  @Min(18, { message: 'Age must be greater than or equal to 18' })
  @Max(99)
  age: number;

  @IsString()
  @IsNotEmpty()
  @IsIn(['M', 'F'], {
    message: 'Gender must be either M for Masculino or F for Femeninto',
  })
  gender: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  birthdate: Date;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1, { message: 'Role not valid' })
  @Max(2, { message: 'Role not valid' })
  rol: number;
}
