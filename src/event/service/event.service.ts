import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RedisServiceInterface } from 'src/redis/interface/redis.service.interface';

import { EventServiceInterface } from '../interface/event.service.interface';

@Injectable()
export class EventService implements EventServiceInterface {
  constructor(
    @Inject('RedisServiceInterface')
    private readonly redisService: RedisServiceInterface,
  ) {}

  @OnEvent('user.load')
  async loadUserInfo(key: string, data: any) {
    await this.redisService.set(key, data);
  }

  @OnEvent('user.update')
  async updateUserInfo(key: string, data: any) {
    await this.redisService.set(key, data);
  }

  @OnEvent('user.delete')
  async deleteUserInfo(key: string) {
    return await this.redisService.del(key);
  }
}
