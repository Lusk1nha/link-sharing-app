import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/common/database/database.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { CredentialsModule } from '../credentials/credentials.module';
import { PasswordModule } from '../password/password.module';
import { SessionsModule } from '../sessions/sessions.module';
import { AuthProviderModule } from '../auth-providers/auth-providers.module';

@Module({
  imports: [
    UsersModule,
    CredentialsModule,
    AuthProviderModule,
    PasswordModule,
    SessionsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
