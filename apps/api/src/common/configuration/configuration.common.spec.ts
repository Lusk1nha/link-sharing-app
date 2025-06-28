import configuration from './configuration.common';

describe('Configuration Common', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should be defined', () => {
    expect(configuration).toBeDefined();
  });

  describe('PORT environment variable', () => {
    it('should use PORT from environment variables when defined', () => {
      process.env.PORT = '4000';
      const result = configuration();
      expect(result.port).toBe(4000);
    });

    it('should default to 3000 when PORT is not defined', () => {
      delete process.env.PORT;
      const result = configuration();
      expect(result.port).toBe(3000);
    });

    it('should parse PORT as integer', () => {
      process.env.PORT = '4000';
      const result = configuration();
      expect(typeof result.port).toBe('number');
      expect(result.port).toBe(4000);
    });
  });

  describe('DATABASE_URL environment variable', () => {
    it('should use DATABASE_URL from environment variables when defined', () => {
      process.env.DATABASE_URL = 'postgres://user:password@localhost:5432/mydb';
      const result = configuration();
      expect(result.database.url).toBe(
        'postgres://user:password@localhost:5432/mydb',
      );
    });

    it('should return undefined for DATABASE_URL when not defined', () => {
      delete process.env.DATABASE_URL;
      const result = configuration();
      expect(result.database.url).toBeUndefined();
    });

    it('should handle DATABASE_URL as a string', () => {
      process.env.DATABASE_URL = 'postgres://user:password@localhost:5432/mydb';
      const result = configuration();
      expect(typeof result.database.url).toBe('string');
      expect(result.database.url).toBe(
        'postgres://user:password@localhost:5432/mydb',
      );
    });
  });

  describe('REDIS configuration', () => {
    it('should use REDIS_HOST from environment variables when defined', () => {
      process.env.REDIS_HOST = 'redis-server';
      const result = configuration();
      expect(result.redis.host).toBe('redis-server');
    });

    it("should default REDIS_HOST to 'localhost' when not defined", () => {
      delete process.env.REDIS_HOST;
      const result = configuration();
      expect(result.redis.host).toBe('localhost');
    });

    it('should use REDIS_PORT from environment variables when defined', () => {
      process.env.REDIS_PORT = '6380';
      const result = configuration();
      expect(result.redis.port).toBe(6380);
    });

    it('should default REDIS_PORT to 6379 when not defined', () => {
      delete process.env.REDIS_PORT;
      const result = configuration();
      expect(result.redis.port).toBe(6379);
    });
  });
});
