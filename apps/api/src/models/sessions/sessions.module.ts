import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { HashService } from '../hash/hash.service';
import { TokenService } from '../token/token.service';
import { SessionsCacheService } from '../sessions-cache/sessions-cache.service';

@Module({
  providers: [SessionsService, SessionsCacheService, HashService, TokenService],
})
export class SessionsModule {}
