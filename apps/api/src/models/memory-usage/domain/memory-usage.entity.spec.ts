import { MemoryUsageEntity } from './memory-usage.entity';

describe(MemoryUsageEntity.name, () => {
  it('should be defined', () => {
    expect(MemoryUsageEntity).toBeDefined();
  });

  it('should create an instance of MemoryUsageEntity', () => {
    const memoryUsage = new MemoryUsageEntity({
      rss: '100 MB',
      heapTotal: '50 MB',
      heapUsed: '30 MB',
      external: '20 MB',
    });

    expect(memoryUsage).toBeInstanceOf(MemoryUsageEntity);
  });

  it('should have the correct properties', () => {
    const memoryUsage = new MemoryUsageEntity({
      rss: '100 MB',
      heapTotal: '50 MB',
      heapUsed: '30 MB',
      external: '20 MB',
    });

    expect(memoryUsage.rss).toBe('100 MB');
    expect(memoryUsage.heapTotal).toBe('50 MB');
    expect(memoryUsage.heapUsed).toBe('30 MB');
    expect(memoryUsage.external).toBe('20 MB');
  });
});
