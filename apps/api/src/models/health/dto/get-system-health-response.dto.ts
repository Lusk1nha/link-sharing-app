import { ApiProperty } from '@nestjs/swagger';
import { HealthEntity } from '../domain/health.entity';
import { HealthStatus } from '../__types__/health.types';

export class GetSystemHealthResponseDto {
  @ApiProperty({
    enum: [HealthStatus.HEALTHY, HealthStatus.DEGRADED, HealthStatus.UNHEALTHY],
    description: 'Service status',
  })
  status: HealthStatus;

  @ApiProperty({
    description: 'Service name',
  })
  service: string;

  @ApiProperty({
    description: 'Service version',
  })
  version: string;

  @ApiProperty({
    description: 'Timestamp of the health check',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Uptime in seconds',
  })
  uptime: number;

  @ApiProperty({
    description: 'Memory usage statistics',
  })
  checks: HealthEntity;

  @ApiProperty({
    description: 'Error message if any',
  })
  error?: string;
}
