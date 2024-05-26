import { BaseInterfaceRepository } from 'src/common/repositories/base/base.interface.repository';
import { User } from '../entity/user.entity';

export type UserRepositoryInterface = BaseInterfaceRepository<User>;
