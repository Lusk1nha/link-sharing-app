import { Test, TestingModule } from '@nestjs/testing';
import { HashService } from './hash.service';
import { ConfigService } from '@nestjs/config';

describe(HashService.name, () => {
  let hashService: HashService;

  const VALID_SECRET = 'supersecretkey1234567890';
  const VALID_ALGO = 'sha256';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HashService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'HMAC_SECRET':
                  return VALID_SECRET;
                case 'HMAC_ALGORITHM':
                  return VALID_ALGO;
                default:
                  return undefined;
              }
            }),
          },
        },
      ],
    }).compile();

    hashService = module.get<HashService>(HashService);
  });

  it('should be defined', () => {
    expect(hashService).toBeDefined();
  });

  describe('generate', () => {
    it('should generate a valid HMAC', () => {
      const text = 'test';
      const hmac = hashService.generate(text);

      expect(hmac).toBeDefined();
      expect(typeof hmac).toBe('string');
      expect(hmac.length).toBe(64);
    });
  });
});
