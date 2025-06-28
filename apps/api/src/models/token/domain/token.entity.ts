import { TokenType } from '../__types__/token.types';
import { InvalidTokenException } from '../token.errors';

export type TokenRaw = {
  tokenType: TokenType;
  token: string;
  expiresIn?: string | number;
};

export class TokenEntity implements TokenRaw {
  constructor(
    public readonly tokenType: TokenType,
    public readonly token: string,
    public readonly expiresIn: string | number = '60s',
  ) {
    if (!tokenType || typeof token !== 'string' || !token) {
      throw new InvalidTokenException();
    }
  }
}
