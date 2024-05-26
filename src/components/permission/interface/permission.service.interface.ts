import { DeleteResult } from 'typeorm';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import { Permission } from '../enitity/permission.entity';

export interface PermissionServiceInterface {
  create(data: CreatePermissionDto): Promise<Permission>;

  findAll(): Promise<Permission[]>;

  findOneById(id: string): Promise<Permission>;

  updata(id: string, data: UpdatePermissionDto): Promise<Permission>;

  delete(id: string): Promise<DeleteResult>;
}
