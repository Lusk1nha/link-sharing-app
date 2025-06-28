import { TokenEntity } from 'src/models/token/domain/token.entity';

export interface SessionTokens {
  accessToken: TokenEntity;
  refreshToken: TokenEntity;
}
