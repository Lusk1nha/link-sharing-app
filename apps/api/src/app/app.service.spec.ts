import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe(AppService.name, () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        AppService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue?: string) => {
              const config = {
                APP_NAME: 'Auth Learn NestJS',
                APP_DESCRIPTION:
                  'A simple authentication service built with NestJS',
                APP_VERSION: '1.0.0',
                NODE_ENV: 'development',
                DOCS_URL: 'http://localhost:3000/docs',
              };

              return config[key] || defaultValue;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getIndex method', () => {
    it(`should be defined ${AppService.prototype.getIndex.name}`, () => {
      expect(service.getIndex).toBeDefined();
    });

    it(`should return a GetIndexResponseDto with correct values`, async () => {
      const result = await service.getIndex();

      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('version');
      expect(result).toHaveProperty('environment');
      expect(result).toHaveProperty('authors');
      expect(result).toHaveProperty('docsUrl');

      expect(typeof result.name).toBe('string');
      expect(typeof result.description).toBe('string');
      expect(typeof result.version).toBe('string');
      expect(typeof result.environment).toBe('string');
      expect(Array.isArray(result.authors)).toBe(true);
      expect(typeof result.docsUrl).toBe('string');
    });
  });
});
