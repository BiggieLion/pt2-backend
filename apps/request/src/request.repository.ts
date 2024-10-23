import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from './entities/request.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class RequestRepository extends AbstractRepository<Request> {
  protected readonly logger = new Logger(RequestRepository.name);

  constructor(
    @InjectRepository(Request)
    itemsRepository: Repository<Request>,
    entityManager: EntityManager,
  ) {
    super(itemsRepository, entityManager);
  }
}
