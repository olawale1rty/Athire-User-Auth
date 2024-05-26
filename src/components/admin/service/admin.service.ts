import { Inject, Injectable, Logger } from '@nestjs/common';

import axios from 'axios';
import { UserRepositoryInterface } from 'src/components/user/interface/user.repository.interface';

import { IAdminService } from '../interface/admin.service.interface';

@Injectable()
export class AdminService implements IAdminService {
  private logger = new Logger(AdminService.name);

  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async dashboard() {
    const userResponse = await this.userRepository.findAll();

    return {
      users: userResponse.length,
    };
  }
}
