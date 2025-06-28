import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/common/database/database.service';
import { MemoryUsageService } from 'src/models/memory-usage/memory-usage.service';

describe(HealthService.name, () => {
  let healthService: HealthService;
  let configService: ConfigService;
  let memoryUsageService: MemoryUsageService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        HealthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                APP_NAME: 'TestApp',
                APP_VERSION: '1.0.0',
                DB_TIMEOUT_MS: '5000',
              };
              return config[key];
            }),
          },
        },
        MemoryUsageService,
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: jest.fn(),
          },
        },
      ],
    }).compile();

    healthService = module.get<HealthService>(HealthService);
    configService = module.get<ConfigService>(ConfigService);
    memoryUsageService = module.get<MemoryUsageService>(MemoryUsageService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(healthService).toBeDefined();
  });
});
