import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity';
import {
  EntityManager,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class AbstractRepository<T extends AbstractEntity<T>> {
  protected abstract readonly logger: Logger;

  constructor(
    private readonly itemsRepository: Repository<T>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(entity: T): Promise<T> {
    return this.entityManager.save(entity);
  }

  async findOne(
    where: FindOptionsWhere<T>,
    select?: FindOptionsSelect<T>,
    relations?: FindOptionsRelations<T>,
  ): Promise<T> {
    const entity = await this.itemsRepository.findOne({
      where,
      select,
      relations,
    });

    if (!entity) {
      this.logger.warn(
        `Entity not found with the next conditions: ${where}\n${select}\n${relations} `,
      );
      throw new NotFoundException('Entity not found');
    }

    return entity;
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Promise<T> {
    const updateResult = await this.itemsRepository.update(
      where,
      partialEntity,
    );

    if (!updateResult.affected) {
      this.logger.warn('Entity not found with where condition ', where);
      throw new NotFoundException('Entity not found');
    }

    return this.findOne(where);
  }

  async find(where: FindOptionsWhere<T>, select?: FindOptionsSelect<T>) {
    return this.itemsRepository.find({ where, select });
  }

  async findOneAndDelete(where: FindOptionsWhere<T>) {
    return this.itemsRepository.delete(where);
  }
}
