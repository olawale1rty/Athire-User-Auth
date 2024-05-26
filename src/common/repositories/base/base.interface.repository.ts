import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Observable } from 'rxjs';
import { DeleteResult } from 'typeorm';

export interface BaseInterfaceRepository<T> {
  create(data: T | any): Promise<T>;

  findOneById(id: string): Promise<T>;

  findByCondition(filiterCondition: any): Promise<T>;

  findAll(): Promise<Array<T>>;

  update(id: string, data: T | any): Promise<T>;

  remove(id: string): Promise<DeleteResult>;

  findAllByConditions(filiterCondition: any): Promise<Array<T>>;

  findByConditionsAndRelations(
    filterCondition: any,
    relations: any,
  ): Promise<T>;

  findOneInLowercase(
    entityName: string,
    condition: any,
  ): Promise<T>

  findAllByRelations(relations: any): Promise<Array<T>>;

  findByIdAndRelations(id: string, relations: any): Promise<T>;

  findWithRelations(relations: any): Promise<Array<T>>;

  findAndSelect(
    entityName: string,
    condition: any,
    select: string[],
  ): Promise<T>;

  paginate(option: IPaginationOptions): Observable<Pagination<T>>;

  paginateWithRelation(
    option: IPaginationOptions,
    relations: any,
  ): Observable<Pagination<T>>;

  findByQery(query: any): Promise<T[]>;
}
