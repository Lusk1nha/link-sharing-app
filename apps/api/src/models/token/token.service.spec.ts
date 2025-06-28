import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserMapper } from '../users/domain/user.mapper';
import { generateSingleMockUser } from '../users/__mock__/users.mock';
import {
  TOKEN_CONFIG_KEYS,
  TOKEN_TYPES,
  TokenType,
} from './__types__/token.types';
import { TokenEntity } from './domain/token.entity';
import { UserJwtPayload } from 'src/common/auth/__types__/auth.types';
import {
  GeneratingTokenException,
  InvalidTokenException,
  TokenSecretMissingException,
} from './token.errors';

describe(TokenService.name, () => {
  let service: TokenService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                [TOKEN_CONFIG_KEYS.SECRET]: 'test-secret',
                [TOKEN_CONFIG_KEYS.REFRESH_SECRET]: 'refresh-test-secret',
              };

              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe(TokenService.prototype.generateToken.name, () => {
    it('should be defined', () => {
      expect(service.generateToken).toBeDefined();
    });

    it('should generate a access token', async () => {
      const user = UserMapper.toDomain(generateSingleMockUser());
      const tokenType: TokenType = TOKEN_TYPES.ACCESS;

      jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValueOnce('test-access-token');

      const token = await service.generateToken(user, tokenType);

      expect(token).toBeDefined();
      expect(token).toBeInstanceOf(TokenEntity);
      expect(token.tokenType).toBe(tokenType);
    });

    it('should generate a refresh token', async () => {
      const user = UserMapper.toDomain(generateSingleMockUser());
      const tokenType: TokenType = TOKEN_TYPES.REFRESH;

      jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValueOnce('test-refresh-token');

      const token = await service.generateToken(user, tokenType);

      expect(token).toBeDefined();
      expect(token).toBeInstanceOf(TokenEntity);
      expect(token.tokenType).toBe(tokenType);
    });

    it('should throw error for missing secret', async () => {
      const user = UserMapper.toDomain(generateSingleMockUser());
      const tokenType: TokenType = TOKEN_TYPES.ACCESS;

      const key = TOKEN_CONFIG_KEYS.SECRET;

      jest.spyOn(configService, 'get').mockReturnValueOnce(undefined);

      const promise = service.generateToken(user, tokenType);

      await expect(promise).rejects.toThrow(
        new TokenSecretMissingException(key),
      );
    });

    it('should throw error for signing token failure', async () => {
      const user = UserMapper.toDomain(generateSingleMockUser());
      const tokenType: TokenType = TOKEN_TYPES.ACCESS;

      jest
        .spyOn(jwtService, 'signAsync')
        .mockRejectedValueOnce(new Error('Sign error'));

      const promise = service.generateToken(user, tokenType);

      await expect(promise).rejects.toThrow(
        new GeneratingTokenException('Sign error'),
      );
    });
  });

  describe(TokenService.prototype.decodeToken.name, () => {
    it('should be defined', () => {
      expect(service.decodeToken).toBeDefined();
    });

    it('should decode an access token', async () => {
      const token = 'test-access-token';
      const tokenType: TokenType = TOKEN_TYPES.ACCESS;
      const userPayload: UserJwtPayload = {
        sub: 'test-user-id',
        aud: 'api',
        iss: 'auth',
        iat: Date.now(),
        email: 'example@test.com',
      };

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValueOnce(userPayload);

      const decoded = await service.decodeToken(token, tokenType);

      expect(decoded).toBeDefined();
      expect(decoded).toEqual(userPayload);
      expect(decoded.sub).toBe('test-user-id');
      expect(decoded.email).toBe('example@test.com');
    });

    it('should decode a refresh token', async () => {
      const token = 'test-refresh-token';
      const tokenType: TokenType = TOKEN_TYPES.REFRESH;
      const userPayload: UserJwtPayload = {
        sub: 'test-user-id',
        aud: 'api',
        iss: 'auth',
        iat: Date.now(),
        email: 'example@test.com',
      };

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValueOnce(userPayload);

      const decoded = await service.decodeToken(token, tokenType);

      expect(decoded).toBeDefined();
      expect(decoded).toEqual(userPayload);
      expect(decoded.sub).toBe('test-user-id');
      expect(decoded.email).toBe('example@test.com');
    });

    it('should throw error for invalid token', async () => {
      const token = 'invalid-token';
      const tokenType: TokenType = TOKEN_TYPES.ACCESS;

      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockRejectedValueOnce(new Error('Invalid token'));

      const promise = service.decodeToken(token, tokenType);

      await expect(promise).rejects.toThrow(new InvalidTokenException());
    });
  });
});
