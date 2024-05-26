import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/components/user/entity/user.entity';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from '../../../common/repositories/base/base.abstract.repository';

@Injectable()
export class UserRepositoryImpli extends BaseAbstractRepository<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }
}
