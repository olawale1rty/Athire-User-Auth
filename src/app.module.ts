import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ormConfig } from './common/database/config/ormconfig';
import { AuthModule } from './components/auth/auth.module';
import { UserModule } from './components/user/user.module';
import { SendGridModule } from '@anchan828/nest-sendgrid';
import { CommonModule } from './common/common.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SubscriptionsModule } from './components/subscriptions/subscriptions.module';
import { PermissionModule } from './components/permission/permission.module';
import { EventModule } from './event/event.module';
import { RedisModule } from './redis/redis.module';
import { AdminModule } from './components/admin/admin.module';
import { LoggingInterceptor } from './logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(ormConfig()),
    // SendGridModule.forRoot({
    //   apikey: process.env.SENDGRID_API_KEY,
    // }),
    AuthModule,
    UserModule.forRoot(),
    // PlatformModule,
    CommonModule,
    SubscriptionsModule.forRoot(),
    PermissionModule.forRoot(),
    EventModule,
    RedisModule,
    AdminModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    AppService,
  ],
})
export class AppModule {}
