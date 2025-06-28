import { faker } from '@faker-js/faker';
import { Credential } from '@prisma/client';
import {
  generateMock,
  generateSingleMock,
} from '@link-sharing-app/mockup-generator/src/mockup';

export function generateMockCredentials(
  count = 1,
  overrides?: Partial<Credential>,
): Credential[] {
  return generateMock<Credential>(
    () => ({
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      passwordHash: faker.string.alphanumeric(60), // Simulating a password hash
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    }),
    count,
    overrides,
  );
}

export function generateSingleMockCredential(
  overrides?: Partial<Credential>,
): Credential {
  return generateSingleMock<Credential>(
    () => ({
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      passwordHash: faker.string.alphanumeric(60), // Simulating a password hash
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    }),
    overrides,
  );
}
