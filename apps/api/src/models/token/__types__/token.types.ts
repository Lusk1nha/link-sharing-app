export const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
} as const;

export const TOKEN_CONFIG_KEYS = {
  SECRET: 'JWT_SECRET',
  REFRESH_SECRET: 'JWT_REFRESH_SECRET',
  REFRESH_EXPIRATION: 'JWT_REFRESH_EXPIRATION',
} as const;

export type TokenType = (typeof TOKEN_TYPES)[keyof typeof TOKEN_TYPES];
