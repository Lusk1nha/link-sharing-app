import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/database/database.service';
import { AuthProviderService } from './auth-providers.service';
import { AuthProvidersRepository } from './auth-providers.repository';

@Module({
  providers: [AuthProviderService, AuthProvidersRepository, PrismaService],
  exports: [AuthProviderService],
})
export class AuthProviderModule {}
