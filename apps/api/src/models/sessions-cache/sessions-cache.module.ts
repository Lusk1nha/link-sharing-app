import { Module } from '@nestjs/common';
import { SessionsCacheService } from './sessions-cache.service';
import { HashService } from '../hash/hash.service';

@Module({
  providers: [SessionsCacheService, HashService],
})
export class SessionsCacheModule {}
