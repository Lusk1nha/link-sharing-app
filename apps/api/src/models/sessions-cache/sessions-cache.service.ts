import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { HashService } from '../hash/hash.service';
import { REDIS_KEYS } from '../sessions/__types__/sessions.types';
import { UserEntity } from '../users/domain/user.entity';
import { TokenEntity } from '../token/domain/token.entity';

export const EXPIRATION_TTL = 7 * 24 * 60 * 60; // 7 days in seconds

@Injectable()
export class SessionsCacheService {
  private readonly logger = new Logger(SessionsCacheService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly hashService: HashService,
  ) {}

  async getSessionFromCache(refreshToken: string): Promise<string | null> {
    const tokenHash = this.hashService.generate(refreshToken);
    const cacheKey = `${REDIS_KEYS.REFRESH_TOKEN_PREFIX}${tokenHash}`;

    const userId = await this.cacheService.get<string>(cacheKey);

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

    const cacheKey = `${REDIS_KEYS.REFRESH_TOKEN_PREFIX}${tokenHash}`;

    const cacheValue = user.id.value;

    const result = await this.cacheService.set(
      cacheKey,
      cacheValue,
      EXPIRATION_TTL,
    );

    this.logger.log(
      `Session saved in cache for user ${user.id.value} with token hash ${tokenHash}`,
    );

    return result;
  }

  async deleteSessionFromCache(previousToken: string) {
    const tokenHash = this.hashService.generate(previousToken);
    const cacheKey = `${REDIS_KEYS.REFRESH_TOKEN_PREFIX}${tokenHash}`;

    const result = await this.cacheService.del(cacheKey);

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
