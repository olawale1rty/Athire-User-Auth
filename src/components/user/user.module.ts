import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenRepositoryImpli } from 'src/components/token/repository/token.repository';
import { UserRepositoryImpli } from 'src/components/user/repository/user.repository';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { Token } from '../token/entity/token.entity';
import { TokenService } from '../token/service/token.service';
import { UserController } from './controller/user.controller';
import { UserRole } from './entity/user-role.entity';
import { User } from './entity/user.entity';
import { UserRoleRepositoryImpli } from './repository/user-role.repository';
import { UserService } from './service/user.service';

@Module({
  imports: [
    SubscriptionsModule.forRoot(),
    TypeOrmModule.forFeature([User, UserRole, Token]),
  ],
  controllers: [UserController],
  providers: [],
})
export class UserModule {
  static forRoot(): DynamicModule {
    return {
      module: UserModule,
      providers: [
        {
          provide: 'UserRepositoryInterface',
          useClass: UserRepositoryImpli,
        },
        {
          provide: 'UserServiceInterface',
          useClass: UserService,
        },
        {
          provide: 'UserRoleRepositoryInterface',
          useClass: UserRoleRepositoryImpli,
        },
        {
          provide: 'TokenRepositoryInterface',
          useClass: TokenRepositoryImpli,
        },
        {
          provide: 'TokenServiceInterface',
          useClass: TokenService,
        },
      ],
      exports: [
        'UserRepositoryInterface',
        'UserServiceInterface',
        'UserRoleRepositoryInterface',
        'TokenRepositoryInterface',
        'TokenServiceInterface',
      ],
    };
  }
}
