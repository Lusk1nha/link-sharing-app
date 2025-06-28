import { MemoryUsageEntity } from 'src/models/memory-usage/domain/memory-usage.entity';

export interface HealthRaw {
  status: HealthStatus;
  memoryUsage?: MemoryUsageEntity | null;
}

export enum HealthStatus {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  UNHEALTHY = 'unhealthy',
}
