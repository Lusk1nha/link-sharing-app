import { MemoryUsageRaw } from '../__types__/memory-usage.types';
import { MemoryUsageEntity } from './memory-usage.entity';

export class MemoryUsageMapper {
  static toDomain(raw: MemoryUsageRaw): MemoryUsageEntity {
    return new MemoryUsageEntity(raw);
  }

  static toRaw(domain: MemoryUsageEntity): MemoryUsageRaw {
    return {
      rss: domain.rss,
      heapTotal: domain.heapTotal,
      heapUsed: domain.heapUsed,
      external: domain.external,
    };
  }
}
