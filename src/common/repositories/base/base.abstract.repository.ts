import { NotFoundException } from '@nestjs/common';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Observable, from, map } from 'rxjs';
import { ApiHttpResponse } from 'src/common/enums/api-http-response.enum';
import { DeleteResult, Repository } from 'typeorm';
import { BaseInterfaceRepository } from './base.interface.repository';

export abstract class BaseAbstractRepository<T>
  implements BaseInterfaceRepository<T>
{
  private entity: Repository<T>;

  protected constructor(entity: Repository<T>) {
    this.entity = entity;
  }

  async create(data: T | any): Promise<T> {
    return this.entity.save(data);
  }

  async findOneById(id: string): Promise<T> {
    return this.entity.findOne({
    where: { id } as any
  });
  }

  async findByCondition(filiterCondition: any): Promise<T> {
    return this.entity.findOne({ where: filiterCondition });
  }

  async findAll(): Promise<T[]> {
    return this.entity.find();
  }

  async update(id: string, data: any): Promise<T> {
    const et = await this.entity.preload({
      id: id,
      ...data,
    });

    if (!et) {
      throw new NotFoundException(ApiHttpResponse.NOT_FOUND);
    }

    return this.entity.save(et);
  }

  async remove(id: string): Promise<DeleteResult> {
    return this.entity.delete(id);
  }

  async findByConditionsAndRelations(
    filterCondition: any,
    relations: any,
  ): Promise<T> {
    return this.entity.findOne({
      where: filterCondition,
      relations: relations,
    });
  }

  async findAllByConditions(filiterCondition: any): Promise<T[]> {
    return this.entity.find({ where: filiterCondition });
  }

  async findAllByRelations(relations: any): Promise<T[]> {
    return this.entity.find(relations);
  }

  async findByIdAndRelations(id: string, relations: any): Promise<T> {
    return this.entity.findOne({
    where: { id } as any,
    relations,
  });
  }

  async findWithRelations(relations: any): Promise<T[]> {
    return this.entity.find(relations);
  }

  async findAndSelect(
    entityName: string,
    condition: any,
    select: string[],
  ): Promise<T> {
    return this.entity
      .createQueryBuilder(entityName)
      .where(condition)
      .select(select)
      .getOne();
  }

  async findOneInLowercase(
    entityName: string,
    condition: any,
  ): Promise<T> {
    return this.entity
      .createQueryBuilder(entityName)
      .where(`LOWER(${entityName}.email) = LOWER(:email)`,condition)
      .getOne();
  }

  paginate(option: IPaginationOptions): Observable<Pagination<T>> {
    return from(paginate<T>(this.entity, option)).pipe(
      map((entityPegeable: Pagination<T>) => {
        return entityPegeable;
      }),
    );
  }

  paginateWithRelation(
    option: IPaginationOptions,
    relations: any,
  ): Observable<Pagination<T>> {
    return from(paginate<T>(this.entity, option, relations)).pipe(
      map((entity: Pagination<T>) => entity),
    );
  }

  findByQery(query: any): Promise<T[]> {
    return this.entity.query(query);
  }

  // async paginateWithRelations(
  //   option: IPaginationOptions,
  //   relations: any,
  //   query: string,
  // ): Promise<Pagination<T>> {
  //   const queryBuilder = this.entity.createQueryBuilder().where(query);
  // }
}
