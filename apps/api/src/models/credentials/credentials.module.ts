import { Module } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { PrismaService } from 'src/common/database/database.service';

@Module({
  providers: [CredentialsService, PrismaService],
})
export class CredentialsModule {}
