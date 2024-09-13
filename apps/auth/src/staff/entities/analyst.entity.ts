import { ChildEntity, Column } from 'typeorm';
import { Staff } from './staff.entity';

@ChildEntity('analyst')
export class Analyst extends Staff {
  @Column({ nullable: false, type: 'boolean', default: false })
  is_eval_credit: boolean;
}
