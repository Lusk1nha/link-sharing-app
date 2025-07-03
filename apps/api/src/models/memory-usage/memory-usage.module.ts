import { Module } from '@nestjs/common';
import { MemoryUsageService } from './memory-usage.service';

@Module({
  providers: [MemoryUsageService],
  exports: [MemoryUsageService],
})
export class MemoryUsageModule {}
