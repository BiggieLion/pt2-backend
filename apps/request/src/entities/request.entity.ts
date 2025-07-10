import { AbstractEntity } from '@app/common';
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity('request')
export class Request extends AbstractEntity<Request> {
  @Column({ nullable: false, type: 'varchar' })
  requester_id: string;

  @Column({ nullable: true, type: 'varchar' })
  analyst_id: string;

  @Column({ nullable: true, type: 'varchar' })
  supervisor_id: string;

  @Column({ nullable: false, type: 'smallint' })
  credit_type: number;

  @Column({ nullable: true, type: 'varchar' })
  url_ine: string;

  @Column({ nullable: true, type: 'varchar' })
  url_birth_certificate: string;

  @Column({ nullable: true, type: 'varchar' })
  url_address: string;

  @Column({ nullable: false, type: 'smallint', default: 1 })
  status: number;

  @Column({ nullable: false, type: 'smallint' })
  loan_term: number;

  @Column({ nullable: false, type: 'int' })
  amount: number;

  @Column({ nullable: true, type: 'smallint' })
  guarantee_type: number;

  @Column({ nullable: true, type: 'int' })
  guarantee_value: number;

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
