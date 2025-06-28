import { MemoryUsageMapper } from 'src/models/memory-usage/domain/memory-usage.mapper';
import { HealthStatus } from '../__types__/health.types';
import { HealthEntity } from './health.entity';

describe(HealthEntity.name, () => {
  it('should be defined', () => {
    expect(HealthEntity).toBeDefined();
  });

  it('should create an instance of HealthEntity', () => {
    const memoryUsage = MemoryUsageMapper.toDomain({
      external: '100',
      rss: '200',
      heapTotal: '300',
      heapUsed: '150',
    });
    const health = new HealthEntity(HealthStatus.HEALTHY, memoryUsage);

    expect(health).toBeInstanceOf(HealthEntity);
    expect(health.status).toBe(HealthStatus.HEALTHY);
    expect(health.memoryUsage).toEqual(memoryUsage);
  });

  it('should have the correct properties', () => {
    const memoryUsage = MemoryUsageMapper.toDomain({
      external: '100',
      rss: '200',
      heapTotal: '300',
      heapUsed: '150',
    });
    const health = new HealthEntity(HealthStatus.DEGRADED, memoryUsage);

    expect(health.status).toBe(HealthStatus.DEGRADED);
    expect(health.memoryUsage).toEqual(memoryUsage);
  });

  it('should handle null memory usage', () => {
    const health = new HealthEntity(HealthStatus.UNHEALTHY);

    expect(health.status).toBe(HealthStatus.UNHEALTHY);
    expect(health.memoryUsage).toBeNull();
  });
});
