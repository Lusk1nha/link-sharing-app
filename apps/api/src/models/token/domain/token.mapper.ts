import { TokenEntity, TokenRaw } from './token.entity';

export class TokenMapper {
  static toDomain(raw: TokenRaw): TokenEntity {
    return new TokenEntity(raw.tokenType, raw.token, raw.expiresIn);
  }

  static toModel(entity: TokenEntity): TokenRaw {
    return {
      tokenType: entity.tokenType,
      token: entity.token,
      expiresIn: entity.expiresIn,
    };
  }
}
