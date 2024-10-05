import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { Requester } from './entities/requester.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RequesterRepository extends AbstractRepository<Requester> {
  protected readonly logger = new Logger(RequesterRepository.name);

  constructor(
    @InjectRepository(Requester)
    itemsRepository: Repository<Requester>,
    entityManager: EntityManager,
  ) {
    super(itemsRepository, entityManager);
  }
}
