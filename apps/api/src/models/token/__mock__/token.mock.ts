import {
  generateMock,
  generateSingleMock,
} from '@link-sharing-app/mockup-generator/src/mockup';
import { TokenRaw } from '../domain/token.entity';
import { faker } from '@faker-js/faker/.';
import { TOKEN_TYPES } from '../__types__/token.types';

export function generateMockTokens(
  count = 1,
  overrides?: Partial<TokenRaw>,
): TokenRaw[] {
  return generateMock<TokenRaw>(
    () => ({
      token: faker.string.alphanumeric(32),
      tokenType: faker.helpers.arrayElement([
        TOKEN_TYPES.ACCESS,
        TOKEN_TYPES.REFRESH,
      ]),
      expiresIn: faker.number.int({ min: 60, max: 3600 }),
    }),
    count,
    overrides,
  );
}

export function generateSingleMockToken(
  overrides?: Partial<TokenRaw>,
): TokenRaw {
  return generateSingleMock<TokenRaw>(
    () => ({
      token: faker.string.alphanumeric(32),
      tokenType: faker.helpers.arrayElement([
        TOKEN_TYPES.ACCESS,
        TOKEN_TYPES.REFRESH,
      ]),
      expiresIn: faker.number.int({ min: 60, max: 3600 }),
    }),
    overrides,
  );
}
