import { AbstractEntity } from '@app/common';
import { Column, Entity } from 'typeorm';

@Entity('request')
export class Request extends AbstractEntity<Request> {
  @Column({ nullable: false, type: 'int' })
  requester_id: number;

  @Column({ nullable: false, type: 'int' })
  analyst_id: number;

  @Column({ nullable: false, type: 'int' })
  supervisor_id: number;

  @Column({ nullable: false, type: 'smallint' })
  credit_id: number;

  @Column({ nullable: true, type: 'varchar' })
  url_ine: string;

  @Column({ nullable: true, type: 'varchar' })
  url_birth_certificate: string;

  @Column({ nullable: true, type: 'varchar' })
  url_address: string;

  @Column({ nullable: false, type: 'boolean', default: false })
  is_approved: boolean;
}
