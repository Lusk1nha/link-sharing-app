import { faker } from '@faker-js/faker/.';
import {
  generateMock,
  generateSingleMock,
} from '@link-sharing-app/mockup-generator/src/mockup';
import { AuthProvider, AuthSignInType } from '@prisma/client';

export function generateMockAuthProviders(
  count = 1,
  overrides?: Partial<AuthProvider>,
): AuthProvider[] {
  return generateMock<AuthProvider>(
    () => ({
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      providerType: faker.helpers.enumValue(AuthSignInType),
      providerId: faker.string.uuid(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    }),
    count,
    overrides,
  );
}

export function generateSingleMockAuthProvider(
  overrides?: Partial<AuthProvider>,
): AuthProvider {
  return generateSingleMock<AuthProvider>(
    () => ({
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      providerType: faker.helpers.enumValue(AuthSignInType),
      providerId: faker.string.uuid(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    }),
    overrides,
  );
}
