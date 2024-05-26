import { DynamicModule, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AdminController } from './controller/admin.controller';
import { AdminService } from './service/admin.service';

@Module({
  imports: [UserModule.forRoot()],
  controllers: [AdminController],
})
export class AdminModule {
  static forRoot(): DynamicModule {
    return {
      module: AdminModule,
      providers: [
        {
          provide: 'IAdminService',
          useClass: AdminService,
        },
      ],
    };
  }
}
