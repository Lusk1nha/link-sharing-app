import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { MemoryUsageService } from 'src/models/memory-usage/memory-usage.service';
import { PrismaService } from 'src/common/database/database.service';

@Module({
  controllers: [HealthController],
  providers: [HealthService, MemoryUsageService, PrismaService],
})
export class HealthModule {}
