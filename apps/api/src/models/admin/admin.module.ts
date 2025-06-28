import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/database/database.service';
import { AdminService } from './admin.service';

@Module({
  providers: [AdminService, PrismaService],
})
export class AdminModule {}
