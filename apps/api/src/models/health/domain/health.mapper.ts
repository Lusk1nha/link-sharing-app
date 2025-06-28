import { HealthRaw } from '../__types__/health.types';
import { HealthEntity } from './health.entity';

export class HealthMapper {
  static toDomain(raw: HealthRaw): HealthEntity {
    return new HealthEntity(raw.status, raw.memoryUsage ?? null);
  }
}
