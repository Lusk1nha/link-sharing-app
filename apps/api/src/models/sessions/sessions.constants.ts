export const TOKEN_TYPES = {
  ACCESS: "access",
  REFRESH: "refresh",
} as const;

export const TOKEN_CONFIG_KEYS = {
  SECRET: "JWT_SECRET",
  REFRESH_SECRET: "JWT_REFRESH_SECRET",
  HMAC_SECRET: "HMAC_SECRET",
  REFRESH_EXPIRATION: "JWT_REFRESH_EXPIRATION",
} as const;

export const REDIS_KEYS = {
  REFRESH_TOKEN_PREFIX: "refreshToken:",
  USER_TOKENS_PREFIX: "userRefreshTokens:",
} as const;
