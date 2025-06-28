import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/common/database/database.service';
import { GetSystemHealthResponseDto } from './dto/get-system-health-response.dto';
import { MemoryUsageService } from 'src/models/memory-usage/memory-usage.service';
import { HealthCannotSetEnvironmentVariableException } from './health.errors';

import { HealthStatus } from './__types__/health.types';
import { HealthMapper } from './domain/health.mapper';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private readonly dbTimeoutMs: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly memoryUsageService: MemoryUsageService,
    private readonly prisma: PrismaService,
  ) {
    this.dbTimeoutMs = Number(
      this.getEnvironmentVariable('DB_TIMEOUT_MS', '5000'),
    );
  }

  async getSystemHealth(): Promise<GetSystemHealthResponseDto> {
    const service = this.getEnvironmentVariable('APP_NAME');
    const version = this.getEnvironmentVariable('APP_VERSION');

    const [dbResult, memResult] = await Promise.allSettled([
      this.checkDatabaseConnection(),
      this.memoryUsageService.getMemoryUsage(),
    ]);

    const dbHealthy = dbResult.status === 'fulfilled' && dbResult.value;
    const memoryUsage =
      memResult.status === 'fulfilled' ? memResult.value : null;

    if (!dbHealthy && dbResult.status === 'rejected') {
      this.logger.error(dbResult.reason.stack || dbResult.reason);
    }

    const details = HealthMapper.toDomain({
      status: dbHealthy ? HealthStatus.HEALTHY : HealthStatus.UNHEALTHY,
      memoryUsage: memoryUsage ?? null,
    });

    return {
      service,
      version,
      status: dbHealthy ? HealthStatus.HEALTHY : HealthStatus.UNHEALTHY,
      checks: details,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }

  private async checkDatabaseConnection(): Promise<boolean> {
    const timeout = new Promise<boolean>((resolve) =>
      setTimeout(() => resolve(false), this.dbTimeoutMs),
    );
    const query = (async () => {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    })();
    return Promise.race([query, timeout]);
  }

  private getEnvironmentVariable(key: string, defaultValue?: string): string {
    const value =
      defaultValue !== undefined
        ? this.configService.get<string>(key, defaultValue)
        : this.configService.get<string>(key);

    if (!value) {
      this.logger.error(`Environment variable ${key} is not set.`);
      throw new HealthCannotSetEnvironmentVariableException(key);
    }

    return value;
  }
}
