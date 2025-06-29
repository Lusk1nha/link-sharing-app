import { ExecutionContext } from '@nestjs/common';
import { extractAuthenticatedUser } from '../auth.decorator';
import { AuthenticatedUserPayload } from '../__types__/auth.types';
import { faker } from '@faker-js/faker/.';
import { Role } from 'src/common/roles/roles.common';
import { ImpossibleToGetUserFromRequestException } from '../auth-common.errors';

describe('@GetAuthUser decorator via (extractAuthenticatedUser)', () => {
  const mockRequest = {
    user: {
      sub: faker.string.uuid(),
      aud: faker.string.uuid(),
      iss: faker.string.uuid(),
      iat: Date.now(),
      email: faker.internet.email(),
      roles: [faker.helpers.enumValue(Role)],
    } as AuthenticatedUserPayload,
  };

  const emptyRequest = {
    user: undefined,
  };

  const createMockContext = (): ExecutionContext =>
    ({
      switchToHttp: () => ({ getRequest: () => mockRequest }),
    }) as any;

  const createEmptyMockContext = (): ExecutionContext =>
    ({
      switchToHttp: () => ({ getRequest: () => emptyRequest }),
    }) as any;

  it('should be defined', () => {
    expect(extractAuthenticatedUser).toBeDefined();
  });

  it('should extract user from request', () => {
    const ctx = createMockContext();
    const result = extractAuthenticatedUser(undefined, ctx);
    expect(result).toEqual(mockRequest.user);
  });

  it('should throw an error if user is not present in request', () => {
    const ctx = createEmptyMockContext();
    expect(() => extractAuthenticatedUser(undefined, ctx)).toThrow(
      new ImpossibleToGetUserFromRequestException(),
    );
  });
});
