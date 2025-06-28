import { MemoryUsageMapper } from './memory-usage.mapper';

describe(MemoryUsageMapper.name, () => {
  it('should be defined', () => {
    expect(MemoryUsageMapper).toBeDefined();
  });

  describe('toDomain', () => {
    it(`should be defined function ${MemoryUsageMapper.toDomain.name}`, () => {
      expect(MemoryUsageMapper.toDomain).toBeDefined();
    });

    it('should map raw memory usage data to MemoryUsageEntity', () => {
      const raw = {
        rss: '100 MB',
        heapTotal: '50 MB',
        heapUsed: '30 MB',
        external: '20 MB',
      };

      const result = MemoryUsageMapper.toDomain(raw);
      expect(result).toBeDefined();
      expect(result.rss).toBe('100 MB');
      expect(result.heapTotal).toBe('50 MB');
      expect(result.heapUsed).toBe('30 MB');
      expect(result.external).toBe('20 MB');
    });
  });

  describe('toRaw', () => {
    it(`should be defined function ${MemoryUsageMapper.toRaw.name}`, () => {
      expect(MemoryUsageMapper.toRaw).toBeDefined();
    });

    it('should map MemoryUsageEntity to raw memory usage data', () => {
      const entity = {
        rss: '100 MB',
        heapTotal: '50 MB',
        heapUsed: '30 MB',
        external: '20 MB',
      };

      const result = MemoryUsageMapper.toRaw(entity);
      expect(result).toBeDefined();
      expect(result.rss).toBe('100 MB');
      expect(result.heapTotal).toBe('50 MB');
      expect(result.heapUsed).toBe('30 MB');
      expect(result.external).toBe('20 MB');
    });
  });
});
