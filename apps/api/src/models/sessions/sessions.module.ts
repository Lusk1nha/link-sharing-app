import { Global, Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsCacheModule } from '../sessions-cache/sessions-cache.module';
import { TokenModule } from '../token/token.module';

@Global()
@Module({
  imports: [SessionsCacheModule, TokenModule],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
