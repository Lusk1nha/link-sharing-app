import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CredentialsService } from '../credentials/credentials.service';
import { PasswordService } from '../password/password.service';
import { PrismaService } from 'src/common/database/database.service';
import { AuthController } from './auth.controller';
import { SessionsService } from '../sessions/sessions.service';
import { HashService } from '../hash/hash.service';
import { TokenService } from '../token/token.service';
import { SessionsCacheService } from '../sessions-cache/sessions-cache.service';
import { AuthProviderService } from '../auth-providers/auth-providers.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    CredentialsService,
    AuthProviderService,
    PasswordService,
    PrismaService,
    SessionsService,
    SessionsCacheService,
    HashService,
    TokenService,
  ],
})
export class AuthModule {}
