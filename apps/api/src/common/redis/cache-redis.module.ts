import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { CacheRedisRepository } from './cache-redis.repository';

@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6379',
    }),
  ],
  providers: [CacheRedisRepository],
  exports: [CacheRedisRepository],
})
export class CacheRedisModule {}
