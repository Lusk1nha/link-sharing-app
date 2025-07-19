import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/database/database.service';
import { AdminService } from './admin.service';
import { AdminRepository } from './admin.repository';

@Module({
  providers: [AdminService, AdminRepository, PrismaService],
  exports: [AdminService],
})
export class AdminModule {}
