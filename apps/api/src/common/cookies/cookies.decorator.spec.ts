import { ExecutionContext } from '@nestjs/common';
import { extractCookies } from './cookies.decorator';

describe('@Cookies decorator (via extractCookies)', () => {
  const mockRequest = {
    cookies: {
      sessionId: 'abc123',
      refreshToken: 'xyz456',
    },
  };

  const createMockContext = (): ExecutionContext =>
    ({
      switchToHttp: () => ({ getRequest: () => mockRequest }),
    }) as any;

  it('should be defined', () => {
    expect(extractCookies).toBeDefined();
  });

  it('should return all cookies when no key is provided', () => {
    const ctx = createMockContext();
    const result = extractCookies(undefined, ctx);
    expect(result).toEqual(mockRequest.cookies);
  });

  it('should returns the cookie data from key', () => {
    const ctx = createMockContext();
    const result = extractCookies('sessionId', ctx);
    expect(result).toBe('abc123');
  });

  it('should return undefined if cookie does not exist', () => {
    const ctx = createMockContext();
    const result = extractCookies('naoExiste', ctx);
    expect(result).toBeUndefined();
  });
});
