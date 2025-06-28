import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from '../users/domain/user.entity';

import { TokenService } from '../token/token.service';

import { SessionTokens } from '../auth/__types__/auth.types';
import { UserJwtPayload } from 'src/common/auth/__types__/auth.types';
import { InvalidSessionException } from './sessions.errors';
import { SessionsCacheService } from '../sessions-cache/sessions-cache.service';

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);

  constructor(
    private readonly tokenService: TokenService,
    private readonly cacheService: SessionsCacheService,
  ) {}

  async createSession(user: UserEntity): Promise<SessionTokens> {
    const tokens = await this.generateTokens(user);
    await this.cacheService.saveSessionInCache(user, tokens.refreshToken);

    return tokens;
  }

  async revalidateByRefreshToken(
    user: UserEntity,
    previousToken: string,
  ): Promise<SessionTokens> {
    await this.validateTokenExists(user, previousToken);
    const tokens = await this.generateTokens(user);

    await this.cacheService.saveSessionInCache(user, tokens.refreshToken);
    await this.cacheService.deleteSessionFromCache(previousToken);

    return tokens;
  }

  async validateRefreshToken(refreshToken: string): Promise<UserJwtPayload> {
    const payload = await this.tokenService.decodeToken(
      refreshToken,
      'refresh',
    );

    if (!payload) {
      throw new InvalidSessionException();
    }

    return payload;
  }

  async revokeByRefreshToken(user: UserEntity, refreshToken: string) {
    await this.validateTokenExists(user, refreshToken);
    await this.cacheService.deleteSessionFromCache(refreshToken);

    this.logger.log(`Session invalidated for user ${user.id.value}`);
  }

  private async validateTokenExists(
    user: UserEntity,
    token: string,
  ): Promise<void> {
    const cachedSession = await this.cacheService.getSessionFromCache(token);

    if (!cachedSession || cachedSession !== user.id.value) {
      this.logger.error(
        `[validateTokenExists] Token ownership validation failed for user ${user.id.value}`,
      );
      throw new InvalidSessionException();
    }
  }

  private async generateTokens(user: UserEntity) {
    const accessToken = await this.tokenService.generateToken(user, 'access');
    const refreshToken = await this.tokenService.generateToken(user, 'refresh');

    return {
      accessToken,
      refreshToken,
    };
  }
}
