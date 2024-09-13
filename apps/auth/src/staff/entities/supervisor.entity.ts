import { ChildEntity, Column } from 'typeorm';
import { Staff } from './staff.entity';

@ChildEntity('supervisor')
export class Supervisor extends Staff {
  @Column({ nullable: false, type: 'smallint' })
  years_labor: number;
}
