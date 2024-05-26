import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ApiHttpResponse } from 'src/common/enums/api-http-response.enum';
import { DeleteResult } from 'typeorm';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import { Permission } from '../enitity/permission.entity';
import { PermissionRepositoryInterface } from '../interface/permission.repository.interface';
import { PermissionServiceInterface } from '../interface/permission.service.interface';

@Injectable()
export class PermissionService implements PermissionServiceInterface {
  private logger = new Logger(PermissionService.name);

  constructor(
    @Inject('PermissionRepositoryInterface')
    private readonly permissionRepository: PermissionRepositoryInterface,
  ) {}

  async create(data: CreatePermissionDto): Promise<Permission> {
    try {
      return this.permissionRepository.create(
        new Permission({
          name: data.name,
        }),
      );
    } catch (err) {
      this.logger.error('Internal server error', err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findAll(): Promise<Permission[]> {
    try {
      return await this.permissionRepository.findAll();
    } catch (err) {
      this.logger.error('Internal server error', err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async findOneById(id: string): Promise<Permission> {
    try {
      const permission = await this.permissionRepository.findOneById(id);

      if (!permission)
        throw new NotFoundException(
          `Permission not ${ApiHttpResponse.NOT_FOUND}`,
        );

      return permission;
    } catch (err) {
      this.logger.error('Internal server error', err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async updata(id: string, data: UpdatePermissionDto): Promise<Permission> {
    try {
      let permission = await this.permissionRepository.findOneById(id);

      if (!permission)
        throw new NotFoundException(
          `Permission not ${ApiHttpResponse.NOT_FOUND}`,
        );

      permission = await this.permissionRepository.update(id, data);

      return permission;
    } catch (err) {
      this.logger.error('Internal server error', err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    try {
      const permission = await this.permissionRepository.findOneById(id);

      if (!permission)
        throw new NotFoundException(
          `Permission not ${ApiHttpResponse.NOT_FOUND}`,
        );

      return this.permissionRepository.remove(id);
    } catch (err) {
      this.logger.error('Internal server error', err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
