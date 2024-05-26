import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../permission/enitity/permission.entity';
import { Subscription } from './enitity/subscriptions.entity';
import { SubscriptionsController } from './controller/subscriptions.controller';
import { PermissionModule } from '../permission/permission.module';
import { SubscriptionsRepositoryImpl } from './repository/subscriptions.repository';
import { SubscriptionsService } from './service/subscriptions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription, Permission]),
    PermissionModule.forRoot(),
  ],
  controllers: [SubscriptionsController],
})
export class SubscriptionsModule {
  static forRoot(): DynamicModule {
    return {
      module: SubscriptionsModule,
      providers: [
        {
          provide: 'SubscriptionsRepositoryInterface',
          useClass: SubscriptionsRepositoryImpl,
        },
        {
          provide: 'SubscriptionsServiceInterface',
          useClass: SubscriptionsService,
        },
      ],
      exports: [
        'SubscriptionsRepositoryInterface',
        'SubscriptionsServiceInterface',
      ],
    };
  }
}
