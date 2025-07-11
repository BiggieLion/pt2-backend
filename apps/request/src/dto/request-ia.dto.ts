import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class RequestIaDto {
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  AMT_INCOME_PER_CHILDREN: number[];

  @IsNumber({}, { each: true })
  @IsNotEmpty()
  AMT_INCOME_PER_FAM_MEMBER: number[];

  @IsNumber({}, { each: true })
  @IsNotEmpty()
  AMT_INCOME_TOTAL: number[];

  @IsNumber({}, { each: true })
  @IsNotEmpty()
  CNT_ADULTS: number[];

  @IsNumber({}, { each: true })
  @IsNotEmpty()
  CNT_CHILDREN: number[];

  @IsNumber({}, { each: true })
  @IsNotEmpty()
  CNT_FAM_MEMBERS: number[];

  @IsNumber({}, { each: true })
  @IsNotEmpty()
  DAYS_BIRTH: number[];

  @IsNumber({}, { each: true })
  @IsNotEmpty()
  DAYS_EMPLOYED: number[];

  @IsNumber({}, { each: true })
  @IsNotEmpty()
  FLAG_OWN_CAR: number[];

  @IsNumber({}, { each: true })
  @IsNotEmpty()
  FLAG_OWN_REALTY: number[];

  @IsNumber({}, { each: true })
  @IsNotEmpty()
  NAME_EDUCATION_TYPE: number[];

  @IsNumber({}, { each: true })
  @IsNotEmpty()
  NAME_FAMILY_STATUS: number[];

  @IsNumber({}, { each: true })
  @IsNotEmpty()
  NAME_HOUSING_TYPE: number[];

  @IsNumber({}, { each: true })
  @IsNotEmpty()
  NAME_INCOME_TYPE: number[];

  @IsNumber({}, { each: true })
  @IsNotEmpty()
  OCCUPATION_TYPE: number[];

  @IsBoolean()
  @IsNotEmpty()
  relation: boolean;
}
