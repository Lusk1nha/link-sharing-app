import { faker } from '@faker-js/faker/locale/en';
import {
  checkRowLevelPermission,
  extractTokenFromHeader,
} from '../auth.common';
import { JwtStoredPayload } from '../__types__/auth.types';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';
import { ForbiddenResourceException } from '../auth-common.errors';
import { Role } from 'src/common/roles/roles.common';

describe(checkRowLevelPermission.name, () => {
  const userId = UUIDFactory.create();
  const baseUser = (roles: Role[] = []): JwtStoredPayload => ({
    sub: userId.value,
    aud: 'test-aud',
    iss: 'test-iss',
    iat: Date.now(),
    email: faker.internet.email(),
    roles,
  });

  it('should be defined', () => {
    expect(checkRowLevelPermission).toBeDefined();
  });

  it('allows an admin even without requestedUid', () => {
    const admin = baseUser([Role.Admin]);
    expect(checkRowLevelPermission(admin)).toBe(true);
  });

  it('throws when requestedUid is undefined and user is not admin', () => {
    const normalUser = baseUser();
    expect(() => checkRowLevelPermission(normalUser)).toThrowError(
      ForbiddenResourceException,
    );
  });

  it.each([
    ['single uid string', userId],
    ['uid inside array', [userId]],
  ])('allows resource owner (%s)', (_, requestedUid) => {
    const me = baseUser();
    expect(checkRowLevelPermission(me, requestedUid)).toBe(true);
  });

  it('throws when user ID does not match requestedUid', () => {
    const otherUid = UUIDFactory.create();
    expect(() => checkRowLevelPermission(baseUser(), otherUid)).toThrow(
      ForbiddenResourceException,
    );
  });

  it('throws when user is undefined', () => {
    expect(() => checkRowLevelPermission(undefined as any, userId)).toThrow(
      ForbiddenResourceException,
    );
  });

  it('throws when none of requestedUid array matches user.sub', () => {
    const ids = [UUIDFactory.create(), UUIDFactory.create()];
    expect(() => checkRowLevelPermission(baseUser(), ids)).toThrow(
      ForbiddenResourceException,
    );
  });
});

describe(extractTokenFromHeader.name, () => {
  const makeReq = (auth?: string) =>
    ({ headers: { authorization: auth } }) as any;

  it.each([
    ['Bearer abc.def', 'abc.def'],
    ['bearer xyz', 'xyz'],
    ['  Bearer   tok123  ', 'tok123'],
  ])('parses valid header "%s"', (header, expected) => {
    expect(extractTokenFromHeader(makeReq(header))).toBe(expected);
  });

  it.each([undefined, '', 'Basic abc', 'Bearer'])(
    'returns undefined for "%s"',
    (header) => {
      expect(extractTokenFromHeader(makeReq(header))).toBeUndefined();
    },
  );
});
