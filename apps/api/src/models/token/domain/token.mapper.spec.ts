import { TokenEntity, TokenRaw } from './token.entity';
import { TokenMapper } from './token.mapper';

describe(TokenMapper.name, () => {
  it('should be defined', () => {
    expect(TokenMapper).toBeDefined();
  });

  describe('toDomain method', () => {
    it('should map token raw to token Entity', () => {
      const tokenRaw: TokenRaw = {
        tokenType: 'access',
        token: 'valid-token',
        expiresIn: '60s',
      };

      const tokenEntity = TokenMapper.toDomain(tokenRaw);
      expect(tokenEntity).toBeDefined();
      expect(tokenEntity.tokenType).toEqual(tokenRaw.tokenType);
      expect(tokenEntity.token).toEqual(tokenRaw.token);
      expect(tokenEntity.expiresIn).toEqual(tokenRaw.expiresIn);
    });
  });

  describe('toModel method', () => {
    it('should map token Entity to token raw', () => {
      const type = 'access';
      const token = 'valid-token';
      const expiresIn = '60s';

      const tokenEntity = new TokenEntity('access', 'valid-token', '60s');

      const tokenRaw = TokenMapper.toModel(tokenEntity);
      expect(tokenRaw).toBeDefined();
      expect(tokenRaw.tokenType).toEqual(type);
      expect(tokenRaw.token).toEqual(token);
      expect(tokenRaw.expiresIn).toEqual(expiresIn);
    });
  });
});
