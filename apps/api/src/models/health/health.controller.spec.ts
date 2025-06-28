import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/common/database/database.service';
import { MemoryUsageService } from 'src/models/memory-usage/memory-usage.service';

describe(HealthController.name, () => {
  let healthController: HealthController;
  let healthService: HealthService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [HealthController],
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
        {
          provide: PrismaService,
          useValue: {
            $queryRaw: jest.fn(),
          },
        },
        MemoryUsageService,
      ],
    }).compile();

    healthController = module.get<HealthController>(HealthController);
    healthService = module.get<HealthService>(HealthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(healthController).toBeDefined();
  });

  describe('checkSystemHealth route', () => {
    it(`should be defined ${HealthController.prototype.checkSystemHealth.name}`, () => {
      expect(healthController.checkSystemHealth).toBeDefined();
    });
  });
});
