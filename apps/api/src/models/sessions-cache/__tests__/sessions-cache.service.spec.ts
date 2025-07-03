import { Cache } from 'cache-manager';
import { HashService } from '../../hash/hash.service';
import {
  SESSION_EXPIRATION_TTL,
  SessionsCacheService,
} from '../sessions-cache.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { generateSingleMockUser } from '../../users/__mock__/users.mock';
import { generateSingleMockToken } from '../../token/__mock__/token.mock';
import { TokenMapper } from '../../token/domain/token.mapper';
import { UserMapper } from '../../users/domain/user.mapper';
import { SESSION_REDIS_KEYS } from '../../sessions/__types__/sessions.types';
import { RedisCacheService } from 'src/models/redis-cache/redis-cache.service';

describe(SessionsCacheService.name, () => {
  let service: SessionsCacheService;
  let hashService: HashService;
  let redisService: RedisCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsCacheService,
        {
          provide: HashService,
          useValue: {
            generate: jest.fn(),
          },
        },
        {
          provide: RedisCacheService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SessionsCacheService>(SessionsCacheService);
    hashService = module.get<HashService>(HashService);
    redisService = module.get<RedisCacheService>(RedisCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(hashService).toBeDefined();
    expect(redisService).toBeDefined();
  });

  describe('getSessionFromCache', () => {
    it('should be defined', () => {
      expect(service.getSessionFromCache).toBeDefined();
    });

    it('should return null if no user ID is found in cache', async () => {
      const refreshToken = 'test-refresh-token';
      const hashedRefreshToken = 'hashed-token';

      jest.spyOn(hashService, 'generate').mockReturnValue(hashedRefreshToken);
      jest.spyOn(redisService, 'get').mockResolvedValue(null);

      const cacheKey = `${SESSION_REDIS_KEYS.REFRESH_TOKEN_PREFIX}${hashedRefreshToken}`;

      const result = await service.getSessionFromCache(refreshToken);
      expect(result).toBeNull();
      expect(hashService.generate).toHaveBeenCalledWith(refreshToken);
      expect(redisService.get).toHaveBeenCalledWith(cacheKey);
    });

    it('should return user ID if found in cache', async () => {
      const refreshToken = 'test-refresh-token';
      const hashedRefreshToken = 'hashed-token';

      jest.spyOn(hashService, 'generate').mockReturnValue(hashedRefreshToken);
      jest.spyOn(redisService, 'get').mockResolvedValue('user-id-123');

      const cacheKey = `${SESSION_REDIS_KEYS.REFRESH_TOKEN_PREFIX}${hashedRefreshToken}`;

      const result = await service.getSessionFromCache(refreshToken);
      expect(result).toBe('user-id-123');
      expect(hashService.generate).toHaveBeenCalledWith(refreshToken);
      expect(redisService.get).toHaveBeenCalledWith(cacheKey);
    });
  });

  describe('saveSessionInCache', () => {
    it('should be defined', () => {
      expect(service.saveSessionInCache).toBeDefined();
    });

    it('should save session in cache', async () => {
      const user = UserMapper.toDomain(generateSingleMockUser());
      const refreshToken = TokenMapper.toDomain(generateSingleMockToken());
      const hashedRefreshToken = 'hashed-token';

      jest.spyOn(hashService, 'generate').mockReturnValue(hashedRefreshToken);
      jest.spyOn(redisService, 'set').mockResolvedValue(true);

      const result = await service.saveSessionInCache(user, refreshToken);

      const cacheKey = `${SESSION_REDIS_KEYS.REFRESH_TOKEN_PREFIX}${hashedRefreshToken}`;
      const cacheValue = user.id.value;

      expect(result).toBe(true);
      expect(hashService.generate).toHaveBeenCalledWith(refreshToken.token);
      expect(redisService.set).toHaveBeenCalledWith(
        cacheKey,
        cacheValue,
        SESSION_EXPIRATION_TTL,
      );
    });
  });

  describe('deleteSessionFromCache', () => {
    it('should be defined', () => {
      expect(service.deleteSessionFromCache).toBeDefined();
    });

    it('should delete previous session from cache', async () => {
      const previousToken = 'test-previous-token';
      const hashedPreviousToken = 'hashed-previous-token';

      jest.spyOn(hashService, 'generate').mockReturnValue(hashedPreviousToken);
      jest.spyOn(redisService, 'del').mockResolvedValue(true);

      const result = await service.deleteSessionFromCache(previousToken);

      const cacheKey = `${SESSION_REDIS_KEYS.REFRESH_TOKEN_PREFIX}${hashedPreviousToken}`;

      expect(result).toBe(true);
      expect(hashService.generate).toHaveBeenCalledWith(previousToken);
      expect(redisService.del).toHaveBeenCalledWith(cacheKey);
    });
  });
});
