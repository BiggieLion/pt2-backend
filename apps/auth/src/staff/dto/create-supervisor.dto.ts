import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateAnalystDto } from './create-analyst.dto';

export class CreateSupervisorDto extends CreateAnalystDto {
  @IsNumber()
  @IsNotEmpty()
  years_labor: number;
}
