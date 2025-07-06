import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { RedisCacheService } from '../redis-cache.service';
import { Test, TestingModule } from '@nestjs/testing';

describe(RedisCacheService.name, () => {
  let service: RedisCacheService;
  let cache: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisCacheService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RedisCacheService>(RedisCacheService);
    cache = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cache).toBeDefined();
  });

  describe('get', () => {
    it('should be defined', () => {
      expect(service.get).toBeDefined();
    });

    it('should return null if key does not exist', async () => {
      jest.spyOn(cache, 'get').mockResolvedValue(null);
      const result = await service.get('nonexistent-key');
      expect(result).toBeNull();
    });

    it('should return value if key exists', async () => {
      const mockValue = { data: 'test' };
      jest.spyOn(cache, 'get').mockResolvedValue(mockValue);
      const result = await service.get('existing-key');
      expect(result).toEqual(mockValue);
    });
  });

  describe('set', () => {
    it('should be defined', () => {
      expect(service.set).toBeDefined();
    });

    it('should set value in cache', async () => {
      const mockValue = { data: 'test' };
      jest.spyOn(cache, 'set').mockResolvedValue(mockValue);

      const result = await service.set('test-key', mockValue, 60);

      expect(result).toEqual(mockValue);
      expect(cache.set).toHaveBeenCalledWith('test-key', mockValue, 60);
    });
  });

  describe('del', () => {
    it('should be defined', () => {
      expect(service.del).toBeDefined();
    });

    it('should delete key from cache', async () => {
      jest.spyOn(cache, 'del').mockResolvedValue(true);

      const result = await service.del('test-key');

      expect(result).toBe(true);
      expect(cache.del).toHaveBeenCalledWith('test-key');
    });

    it('should return false if key does not exist', async () => {
      jest.spyOn(cache, 'del').mockResolvedValue(false);

      const result = await service.del('nonexistent-key');

      expect(result).toBe(false);
      expect(cache.del).toHaveBeenCalledWith('nonexistent-key');
    });
  });
});
