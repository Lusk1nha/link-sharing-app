import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/database/database.service';
import { AuthProviderService } from './auth-providers.service';

@Module({
  providers: [AuthProviderService, PrismaService],
})
export class AuthProviderModule {}
