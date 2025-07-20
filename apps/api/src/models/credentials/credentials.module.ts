import { Module } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { PrismaService } from 'src/common/database/database.service';
import { CredentialsController } from './credentials.controller';

import { PasswordModule } from '../password/password.module';
import { CredentialsRepository } from './credentials.repository';

@Module({
  imports: [PasswordModule],
  controllers: [CredentialsController],
  providers: [CredentialsService, CredentialsRepository, PrismaService],
  exports: [CredentialsService],
})
export class CredentialsModule {}
