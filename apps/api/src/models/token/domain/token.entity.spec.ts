import { TokenEntity } from './token.entity';
import { TokenType } from '../__types__/token.types';
import { InvalidTokenException } from '../token.errors';

describe(TokenEntity.name, () => {
  it('should be defined', () => {
    expect(TokenEntity).toBeDefined();
  });

  describe('constructor valid data', () => {
    it('should create an access type instance', () => {
      const type: TokenType = 'access';
      const token = 'valid-token';
      const expiresIn = '60s';

      const tokenEntity = new TokenEntity(type, token, expiresIn);

      expect(tokenEntity).toBeInstanceOf(TokenEntity);
      expect(tokenEntity.tokenType).toEqual(type);
      expect(tokenEntity.token).toEqual(token);
      expect(tokenEntity.expiresIn).toEqual(expiresIn);
      expect(tokenEntity.tokenType).toBe('access');
    });

    it('should create a refresh type instance', () => {
      const type: TokenType = 'refresh';
      const token = 'valid-refresh-token';
      const expiresIn = '7d';

      const tokenEntity = new TokenEntity(type, token, expiresIn);
      expect(tokenEntity).toBeInstanceOf(TokenEntity);
      expect(tokenEntity.tokenType).toEqual(type);
      expect(tokenEntity.token).toEqual(token);
      expect(tokenEntity.expiresIn).toEqual(expiresIn);
      expect(tokenEntity.tokenType).toBe('refresh');
    });
  });

  describe('constructor invalid data', () => {
    it('should throw an error if tokenType is empty', () => {
      const type = '' as TokenType;
      const token = 'valid-token';

      expect(() => new TokenEntity(type, token)).toThrow(
        new InvalidTokenException(),
      );
    });

    it('should throw an error if token is empty', () => {
      const type: TokenType = 'access';
      const token = '' as string;

      expect(() => new TokenEntity(type, token)).toThrow(
        new InvalidTokenException(),
      );
    });
  });
});
