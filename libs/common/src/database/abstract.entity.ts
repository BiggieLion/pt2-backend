import { PrimaryGeneratedColumn } from 'typeorm';

export class AbstractEntity<T> {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}
