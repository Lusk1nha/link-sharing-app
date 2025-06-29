import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../users/domain/user.entity';
import {
  TOKEN_CONFIG_KEYS,
  TOKEN_TYPES,
  TokenType,
} from './__types__/token.types';
import {
  GeneratingTokenException,
  InvalidTokenException,
  TokenSecretMissingException,
} from './token.errors';

import { ConfigService } from '@nestjs/config';
import { UserJwtPayload } from 'src/common/auth/__types__/auth.types';
import { TokenEntity, TokenRaw } from './domain/token.entity';
import { TokenMapper } from './domain/token.mapper';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateToken(user: UserEntity, type: TokenType): Promise<TokenEntity> {
    const payload = this.createPayload(user);
    const { secret, expiresIn } = this.resolveConfig(type);

    const raw = await this.signToken(type, payload, secret, expiresIn);
    this.logger.log(
      `[generateToken] Generated ${type} token for user ${user.id.value}`,
    );

    return TokenMapper.toDomain(raw);
  }

  async decodeToken(token: string, type: TokenType): Promise<UserJwtPayload> {
    const { secret } = this.resolveConfig(type);

    try {
      return await this.jwtService.verifyAsync(token, {
        secret,
        algorithms: ['HS256'],
      });
    } catch (error) {
      this.logger.error(
        `[decodeToken] Failed to decode ${type} token: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new InvalidTokenException();
    }
  }

  private async signToken(
    type: TokenType,
    payload: UserJwtPayload,
    secret: string,
    expiresIn: string,
  ): Promise<TokenRaw> {
    try {
      const token = await this.jwtService.signAsync(payload, {
        secret,
        algorithm: 'HS256',
        expiresIn,
      });

      return {
        tokenType: type,
        token,
        expiresIn,
      };
    } catch (err: unknown) {
      throw new GeneratingTokenException((err as Error).message);
    }
  }

  private createPayload(user: UserEntity): UserJwtPayload {
    const now = Math.floor(Date.now() / 1000);
    const base: UserJwtPayload = {
      sub: user.id.value,
      aud: 'api',
      iss: 'auth',
      iat: now,
      email: user.email.value,
    };

    return base;
  }

  private resolveConfig(type: TokenType) {
    const key =
      type === TOKEN_TYPES.ACCESS
        ? TOKEN_CONFIG_KEYS.SECRET
        : TOKEN_CONFIG_KEYS.REFRESH_SECRET;

    const secret = this.configService.get<string>(key);

    if (!secret) {
      this.logger.error(
        `[resolveConfig] Missing secret for token type: ${type}`,
      );
      throw new TokenSecretMissingException(key);
    }

    const expiresIn = type === TOKEN_TYPES.ACCESS ? '15m' : '7d';

    return {
      secret,
      expiresIn,
    };
  }
}
