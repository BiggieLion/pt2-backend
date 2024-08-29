import { AbstractEntity } from '@app/common';
import { Column, Entity } from 'typeorm';

@Entity('request')
export class Request extends AbstractEntity<Request> {
  @Column({ nullable: false })
  requester_id: number;

  @Column({ nullable: false })
  analyst_id: number;

  @Column({ nullable: false })
  supervisor_id: number;

  @Column({ nullable: false })
  credit_id: number;

  @Column({ nullable: true })
  url_ine: string;

  @Column({ nullable: true })
  url_birth_certificate: string;

  @Column({ nullable: true })
  url_address: string;

  @Column({ nullable: false })
  is_approved: boolean;
}
