import tokenConstants from './token.constants';

describe('TokenConstants Constants', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('should be defined', () => {
    expect(tokenConstants).toBeDefined();
  });

  it('should read JWT_SECRET, JWT_REFRESH_SECRET, and JWT_REFRESH_EXPIRATION from process.env', () => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
    process.env.JWT_REFRESH_EXPIRATION = '3600';

    const result = tokenConstants();

    expect(result.secret).toBe('test-secret');
    expect(result.refreshSecret).toBe('test-refresh-secret');
    expect(result.refreshExpiration).toBe('3600');
  });

  it('should be undefined if env vars are not set', () => {
    delete process.env.JWT_SECRET;
    delete process.env.JWT_REFRESH_SECRET;
    delete process.env.JWT_REFRESH_EXPIRATION;

    const result = tokenConstants();

    expect(result.secret).toBeUndefined();
    expect(result.refreshSecret).toBeUndefined();
    expect(result.refreshExpiration).toBeUndefined();
  });
});
