import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from 'src/common/repositories/base/base.abstract.repository';
import { Repository } from 'typeorm';
import { Permission } from '../enitity/permission.entity';

export class PermissionRepositoryImpl extends BaseAbstractRepository<Permission> {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {
    super(permissionRepository);
  }
}
