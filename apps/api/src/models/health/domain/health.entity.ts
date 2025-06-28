import { ApiProperty } from '@nestjs/swagger';
import { MemoryUsageEntity } from 'src/models/memory-usage/domain/memory-usage.entity';
import { HealthStatus } from '../__types__/health.types';

export class HealthEntity {
  constructor(status: HealthStatus, memoryUsage?: MemoryUsageEntity | null) {
    this.status = status;
    this.memoryUsage = memoryUsage ?? null;
  }

  @ApiProperty({
    description: 'Check status for the service',
    enum: [HealthStatus.HEALTHY, HealthStatus.DEGRADED, HealthStatus.UNHEALTHY],
    example: HealthStatus.HEALTHY,
  })
  status: HealthStatus;

  @ApiProperty({
    description: 'Check status',
  })
  memoryUsage: MemoryUsageEntity | null;
}
