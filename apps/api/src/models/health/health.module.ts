import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

import { PrismaService } from 'src/common/database/database.service';
import { MemoryUsageModule } from '../memory-usage/memory-usage.module';

@Module({
  imports: [MemoryUsageModule],
  controllers: [HealthController],
  providers: [HealthService, PrismaService],
  exports: [HealthService],
})
export class HealthModule {}
