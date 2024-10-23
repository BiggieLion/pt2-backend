import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { Staff } from './entities/staff.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class StaffRepository extends AbstractRepository<Staff> {
  protected readonly logger = new Logger(StaffRepository.name);

  constructor(
    @InjectRepository(Staff)
    itemsRepository: Repository<Staff>,
    entityManager: EntityManager,
  ) {
    super(itemsRepository, entityManager);
  }
}
