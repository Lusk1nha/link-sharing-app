import { Injectable, Logger } from '@nestjs/common';

import { HashService } from '../hash/hash.service';
import { SESSION_REDIS_KEYS } from '../sessions/__types__/sessions.types';
import { UserEntity } from '../users/domain/user.entity';
import { TokenEntity } from '../token/domain/token.entity';
import { RedisCacheService } from '../redis-cache/redis-cache.service';

export const SESSION_EXPIRATION_TTL = 7 * 24 * 60 * 60; // 7 days in seconds

@Injectable()
export class SessionsCacheService {
  private readonly logger = new Logger(SessionsCacheService.name);

  constructor(
    private readonly hashService: HashService,
    private readonly redisService: RedisCacheService,
  ) {}

  async getSessionFromCache(refreshToken: string): Promise<string | null> {
    const tokenHash = this.hashService.generate(refreshToken);
    const cacheKey = `${SESSION_REDIS_KEYS.REFRESH_TOKEN_PREFIX}${tokenHash}`;

    const userId = await this.redisService.get<string>(cacheKey);

    if (!userId) {
      return null;
    }

    this.logger.log(
      `Session retrieved from cache for token hash ${tokenHash}, user ID=${userId}`,
    );

    return userId;
  }

  async saveSessionInCache(user: UserEntity, refreshToken: TokenEntity) {
    const tokenHash = this.hashService.generate(refreshToken.token);

    const cacheKey = `${SESSION_REDIS_KEYS.REFRESH_TOKEN_PREFIX}${tokenHash}`;

    const cacheValue = user.id.value;

    const result = await this.redisService.set(
      cacheKey,
      cacheValue,
      SESSION_EXPIRATION_TTL,
    );

    this.logger.log(
      `Session saved in cache for user ${user.id.value} with token hash ${tokenHash}`,
    );

    return result;
  }

  async deleteSessionFromCache(previousToken: string) {
    const tokenHash = this.hashService.generate(previousToken);
    const cacheKey = `${SESSION_REDIS_KEYS.REFRESH_TOKEN_PREFIX}${tokenHash}`;

    const result = await this.redisService.del(cacheKey);

    if (result) {
      this.logger.log(
        `Previous session deleted from cache for token hash ${tokenHash}`,
      );
    } else {
      this.logger.warn(
        `No session found in cache to delete for token hash ${tokenHash}`,
      );
    }

    return result;
  }
}
