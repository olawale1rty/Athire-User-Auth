import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER, } from '@nestjs/cache-manager';

import { Cache } from 'cache-manager';

import { RedisServiceInterface } from '../interface/redis.service.interface';

@Injectable()
export class RedisService implements RedisServiceInterface {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async get(key: string) {
    return await this.cacheManager.get(key);
  }

  async set(key: string, value: Record<string, unknown>) {
    await this.cacheManager.set(key, value);
  }

  async del(key: string) {
    await this.cacheManager.del(key);
  }
}
