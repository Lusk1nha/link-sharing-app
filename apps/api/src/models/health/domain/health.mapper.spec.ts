import { faker } from '@faker-js/faker';

import { HealthMapper } from './health.mapper';
import { MemoryUsageMapper } from 'src/models/memory-usage/domain/memory-usage.mapper';
import { HealthStatus } from '../__types__/health.types';

describe(HealthMapper.name, () => {
  it('should map raw health data to domain entity', () => {
    const memoryUsageMock = MemoryUsageMapper.toDomain({
      external: faker.string.numeric(3),
      rss: faker.string.numeric(3),
      heapTotal: faker.string.numeric(3),
      heapUsed: faker.string.numeric(3),
    });

    const rawHealthData = {
      status: HealthStatus.HEALTHY,
      memoryUsage: memoryUsageMock,
    };

    const expectedEntity = HealthMapper.toDomain(rawHealthData);

    expect(expectedEntity.status).toBe(rawHealthData.status);
    expect(expectedEntity.memoryUsage).toEqual(rawHealthData.memoryUsage);
  });

  it('should handle missing memory usage', () => {
    const rawHealthData = { status: HealthStatus.UNHEALTHY };

    const expectedEntity = HealthMapper.toDomain(rawHealthData);

    expect(expectedEntity.status).toBe(rawHealthData.status);
    expect(expectedEntity.memoryUsage).toBeNull();
  });
});
