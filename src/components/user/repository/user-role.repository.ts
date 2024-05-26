import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from 'src/common/repositories/base/base.abstract.repository';
import { Repository } from 'typeorm';
import { UserRole } from '../entity/user-role.entity';

export class UserRoleRepositoryImpli extends BaseAbstractRepository<UserRole> {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {
    super(userRoleRepository);
  }
}
