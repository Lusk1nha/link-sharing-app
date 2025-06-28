import { ApiProperty } from '@nestjs/swagger';
import { MemoryUsageRaw } from '../__types__/memory-usage.types';

export class MemoryUsageEntity {
  constructor(raw: MemoryUsageRaw) {
    this.rss = raw.rss;
    this.heapTotal = raw.heapTotal;
    this.heapUsed = raw.heapUsed;
    this.external = raw.external;
  }

  @ApiProperty({
    description: 'Real memory usage in bytes',
  })
  rss: string;

  @ApiProperty({
    description: 'Heap total memory in bytes',
  })
  heapTotal: string;

  @ApiProperty({
    description: 'Heap used memory in bytes',
  })
  heapUsed: string;

  @ApiProperty({
    description: 'External memory usage in bytes',
  })
  external: string;
}
