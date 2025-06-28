import { Test, TestingModule } from '@nestjs/testing';
import { SessionsService } from '../sessions.service';
import { HashService } from '../../hash/hash.service';
import { TokenService } from '../../token/token.service';

import { SessionsCacheService } from '../../sessions-cache/sessions-cache.service';
import { UserMapper } from '../../users/domain/user.mapper';
import { generateSingleMockUser } from '../../users/__mock__/users.mock';
import { TokenMapper } from '../../token/domain/token.mapper';
import { generateSingleMockToken } from '../../token/__mock__/token.mock';
import { UserEntity } from '../../users/domain/user.entity';
import { TOKEN_TYPES, TokenType } from '../../token/__types__/token.types';
import { UserJwtPayload } from 'src/common/auth/__types__/auth.types';
import { InvalidTokenException } from '../../token/token.errors';

describe(SessionsService.name, () => {
  let service: SessionsService;
  let hashService: HashService;
  let tokenService: TokenService;
  let cacheService: SessionsCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: HashService,
          useValue: {
            generateHmacHash: jest.fn(),
          },
        },
        {
          provide: TokenService,
          useValue: {
            generateToken: jest.fn((user: UserEntity, type: TokenType) => {
              return TokenMapper.toDomain(
                generateSingleMockToken({ tokenType: type }),
              );
            }),
            decodeToken: jest.fn(),
          },
        },
        {
          provide: SessionsCacheService,
          useValue: {
            getSessionFromCache: jest.fn(),
            saveSessionInCache: jest.fn(),
            deleteSessionFromCache: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
    hashService = module.get<HashService>(HashService);
    tokenService = module.get<TokenService>(TokenService);
    cacheService = module.get<SessionsCacheService>(SessionsCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(hashService).toBeDefined();
  });

  describe('createSession', () => {
    it('should be defined', () => {
      expect(service.createSession).toBeDefined();
    });

    it('should create a session and save it in cache', async () => {
      const user = UserMapper.toDomain(generateSingleMockUser());

      const refreshToken = tokenService.generateToken(
        user,
        TOKEN_TYPES.REFRESH,
      );
      const accessToken = tokenService.generateToken(user, TOKEN_TYPES.ACCESS);

      jest
        .spyOn(cacheService, 'getSessionFromCache')
        .mockResolvedValue(user.id.value);

      jest.spyOn(cacheService, 'saveSessionInCache').mockResolvedValue('OK');
      jest
        .spyOn(tokenService, 'generateToken')
        .mockResolvedValueOnce(accessToken)
        .mockResolvedValueOnce(refreshToken);

      const result = await service.createSession(user);

      expect(result).toBeDefined();
      expect(result.accessToken).toEqual(accessToken);
      expect(result.refreshToken).toEqual(refreshToken);
      expect(cacheService.saveSessionInCache).toHaveBeenCalledWith(
        user,
        refreshToken,
      );
    });
  });

  describe('revalidateSessionByRefreshToken', () => {
    it('should be defined', () => {
      expect(service.revalidateByRefreshToken).toBeDefined();
    });

    it('should revalidate session and update cache', async () => {
      const user = UserMapper.toDomain(generateSingleMockUser());
      const previousToken = 'previous-refresh-token';

      const newRefreshToken = tokenService.generateToken(
        user,
        TOKEN_TYPES.REFRESH,
      );
      const newAccessToken = tokenService.generateToken(
        user,
        TOKEN_TYPES.ACCESS,
      );

      jest
        .spyOn(cacheService, 'getSessionFromCache')
        .mockResolvedValue(user.id.value);

      jest.spyOn(cacheService, 'saveSessionInCache').mockResolvedValue('OK');
      jest
        .spyOn(cacheService, 'deleteSessionFromCache')
        .mockResolvedValue(true);

      jest
        .spyOn(tokenService, 'generateToken')
        .mockResolvedValueOnce(newAccessToken)
        .mockResolvedValueOnce(newRefreshToken);

      const result = await service.revalidateByRefreshToken(
        user,
        previousToken,
      );

      expect(result).toBeDefined();
      expect(result.accessToken).toEqual(newAccessToken);
      expect(result.refreshToken).toEqual(newRefreshToken);
      expect(cacheService.saveSessionInCache).toHaveBeenCalledWith(
        user,
        newRefreshToken,
      );
      expect(cacheService.deleteSessionFromCache).toHaveBeenCalledWith(
        previousToken,
      );
    });
  });

  describe('validateRefreshToken', () => {
    it('should be defined', () => {
      expect(service.validateRefreshToken).toBeDefined();
    });

    it('should validate refresh token and return user payload', async () => {
      const refreshToken = 'valid-refresh-token';
      const user = UserMapper.toDomain(generateSingleMockUser());
      const userJwtPayload: UserJwtPayload = {
        sub: user.id.value,
        email: user.email.value,
        aud: 'api',
        iss: 'auth',
        iat: Math.floor(Date.now() / 1000),
      };

      jest.spyOn(tokenService, 'decodeToken').mockResolvedValue(userJwtPayload);

      const result = await service.validateRefreshToken(refreshToken);

      expect(result).toBeDefined();
      expect(result).toEqual(userJwtPayload);
      expect(tokenService.decodeToken).toHaveBeenCalledWith(
        refreshToken,
        TOKEN_TYPES.REFRESH,
      );
    });

    it('should throw InvalidSessionException if token is invalid', async () => {
      const invalidRefreshToken = 'invalid-refresh-token';

      jest
        .spyOn(tokenService, 'decodeToken')
        .mockRejectedValue(new InvalidTokenException());

      const promise = service.validateRefreshToken(invalidRefreshToken);

      await expect(promise).rejects.toThrow(InvalidTokenException);
      expect(tokenService.decodeToken).toHaveBeenCalledWith(
        invalidRefreshToken,
        TOKEN_TYPES.REFRESH,
      );
    });
  });

  describe('revokeByRefreshToken', () => {
    it('should be defined', () => {
      expect(service.revokeByRefreshToken).toBeDefined();
    });

    it('should revoke session by refresh token and delete from cache', async () => {
      const user = UserMapper.toDomain(generateSingleMockUser());
      const refreshToken = 'valid-refresh-token';

      jest
        .spyOn(cacheService, 'getSessionFromCache')
        .mockResolvedValue(user.id.value);

      jest
        .spyOn(cacheService, 'deleteSessionFromCache')
        .mockResolvedValue(true);

      const result = await service.revokeByRefreshToken(user, refreshToken);

      expect(result).toBeUndefined();
      expect(cacheService.deleteSessionFromCache).toHaveBeenCalledWith(
        refreshToken,
      );
      expect(cacheService.getSessionFromCache).toHaveBeenCalledWith(
        refreshToken,
      );
    });
  });
});
