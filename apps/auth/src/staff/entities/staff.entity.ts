import { AbstractEntity } from '@app/common';
import {
  Column,
  CreateDateColumn,
  Entity,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';

@Entity('staff')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Staff extends AbstractEntity<Staff> {
  @Column({ nullable: false, type: 'varchar' })
  firstname: string;

  @Column({ nullable: false, type: 'varchar' })
  lastname: string;

  @Column({ nullable: false, type: 'smallint' })
  age: number;

  @Column({ nullable: false, type: 'varchar' })
  email: string;

  @Column({ nullable: false, type: 'varchar' })
  password: string;

  @Column({ nullable: false, type: 'date' })
  birthdate: Date;

  @Column({ nullable: false, type: 'varchar' })
  address: string;

  @Column({ nullable: false, type: 'smallint' })
  rol: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;
}
