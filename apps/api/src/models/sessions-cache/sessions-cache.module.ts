import { Module } from '@nestjs/common';
import { SessionsCacheService } from './sessions-cache.service';

import { HashModule } from '../hash/hash.module';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';

@Module({
  imports: [HashModule, RedisCacheModule],
  providers: [SessionsCacheService],
  exports: [SessionsCacheService],
})
export class SessionsCacheModule {}
