import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Permission } from './enitity/permission.entity';
import { PermissionRepositoryImpl } from './repository/permission.repository';
import { PermissionService } from './service/permission.service';
import { PermissionController } from './controller/permission.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  controllers: [PermissionController],
})
export class PermissionModule {
  static forRoot(): DynamicModule {
    return {
      module: PermissionModule,
      providers: [
        {
          provide: 'PermissionRepositoryInterface',
          useClass: PermissionRepositoryImpl,
        },
        {
          provide: 'PermissionServiceInterface',
          useClass: PermissionService,
        },
      ],
      exports: ['PermissionRepositoryInterface', 'PermissionServiceInterface'],
    };
  }
}
