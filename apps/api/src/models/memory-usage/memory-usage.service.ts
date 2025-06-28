import { Injectable, Logger } from '@nestjs/common';
import { MemoryUsageCannotBeRetrievedException } from './memory-usage.errors';
import { MemoryUsageRaw } from './__types__/memory-usage.types';
import { MemoryUsageMapper } from './domain/memory-usage.mapper';
import { MemoryUsageEntity } from './domain/memory-usage.entity';

@Injectable()
export class MemoryUsageService {
  private readonly logger = new Logger(MemoryUsageService.name);

  async getMemoryUsage(): Promise<MemoryUsageEntity> {
    try {
      const memoryUsage = process.memoryUsage();
      const format = (bytes: number) =>
        `${(bytes / 1024 / 1024).toFixed(2)} MB`;

      const raw: MemoryUsageRaw = {
        rss: format(memoryUsage.rss),
        heapTotal: format(memoryUsage.heapTotal),
        heapUsed: format(memoryUsage.heapUsed),
        external: format(memoryUsage.external),
      };

      return MemoryUsageMapper.toDomain(raw);
    } catch (error) {
      this.logger.error(
        '[getMemoryUsage] Error retrieving memory usage',
        error.message,
      );
      throw new MemoryUsageCannotBeRetrievedException();
    }
  }
}
