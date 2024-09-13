import { IsBoolean, IsNotEmpty } from 'class-validator';
import { CreateRequesterDto } from '../../requester/dto/create-requester.dto';

export class CreateAnalystDto extends CreateRequesterDto {
  @IsBoolean()
  @IsNotEmpty()
  is_eval_credit: boolean;
}
