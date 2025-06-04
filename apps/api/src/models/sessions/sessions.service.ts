import { Injectable, Logger } from "@nestjs/common";
import { UserModel } from "../users/dto/users.model";
import {
  REDIS_KEYS,
  TOKEN_CONFIG_KEYS,
  TOKEN_TYPES,
} from "./sessions.constants";

import { SessionsJwtService } from "./sessions-jwt.service";
import { SessionsHashService } from "./sessions-hash.service";
import { CacheRedisRepository } from "src/common/redis/cache-redis.repository";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);
  private readonly refreshTokenExpirationInSeconds: number;

  constructor(
    private readonly jwtService: SessionsJwtService,
    private readonly hashService: SessionsHashService,
    private readonly repository: CacheRedisRepository,
    private readonly configService: ConfigService,
  ) {
    this.refreshTokenExpirationInSeconds = this.getRefreshTokenExpiration();
  }

  async generateTokenByUser(user: UserModel) {
    const tokens = await this.generateTokens(user);
    const tokenHash = this.hashService.generateTokenHash(
      tokens.refreshToken.token,
    );

    await this.saveRefreshToken(user, tokenHash);
    return tokens;
  }

  private async saveRefreshToken(user: UserModel, tokenHash: string) {
    const refreshTokenKey = this.getRefreshTokenKey(tokenHash);
    const userTokensKey = this.getUserTokensKey(user.id.value());

    const userId = user.id.value();

    console.log({
      refreshTokenKey,
      userTokensKey,
      userId,
      tokenHash,
      expiration: this.refreshTokenExpirationInSeconds,
    });

    await Promise.all([
      this.repository.saveData(
        refreshTokenKey,
        userId,
        this.refreshTokenExpirationInSeconds,
      ),
      this.repository.addToSet(userTokensKey, tokenHash),
      this.repository.expireKey(
        userTokensKey,
        this.refreshTokenExpirationInSeconds,
      ),
    ]);

    this.logger.log(`Saved refresh token | userId=${userId}`);
  }

  private getRefreshTokenExpiration(): number {
    const days = Number(
      this.configService.get(TOKEN_CONFIG_KEYS.REFRESH_EXPIRATION),
    );
    return days * 24 * 60 * 60;
  }

  private getRefreshTokenKey(tokenHash: string): string {
    return `${REDIS_KEYS.REFRESH_TOKEN_PREFIX}${tokenHash}`;
  }

  private getUserTokensKey(userId: string): string {
    return `${REDIS_KEYS.USER_TOKENS_PREFIX}${userId}`;
  }

  private async generateTokens(user: UserModel) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.createToken(user, TOKEN_TYPES.ACCESS),
      this.jwtService.createToken(user, TOKEN_TYPES.REFRESH),
    ]);

    return { accessToken, refreshToken };
  }
}
