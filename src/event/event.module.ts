import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RedisModule } from 'src/redis/redis.module';
import { EventService } from './service/event.service';

@Module({
  imports: [EventEmitterModule.forRoot(), RedisModule.forRoot()],
  providers: [EventService],
})
export class EventModule {}
