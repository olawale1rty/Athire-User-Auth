import {
  DynamicModule,
  Inject,
  Logger,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { CacheModule, CACHE_MANAGER, } from '@nestjs/cache-manager';
import { RedisService } from './service/redis.service';

import { Cache } from 'cache-manager';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => {
        return {
          store: redisStore,
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
          ttl: 60 * 3600 * 1000,
        };
      },
    }),
  ],
  exports: [CacheModule],
  providers: [],
})
export class RedisModule implements OnModuleInit {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  onModuleInit() {
    const logger = new Logger('Cache');

    logger.log('Redis cache is up and running');
  }

  static forRoot(): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        {
          provide: 'RedisServiceInterface',
          useClass: RedisService,
        },
      ],
      exports: ['RedisServiceInterface'],
    };
  }
}
