import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';
import {
  generateMock,
  generateSingleMock,
} from '@link-sharing-app/mockup-generator/src/mockup';

export function generateMockUsers(
  count = 1,
  overrides?: Partial<User>,
): User[] {
  return generateMock<User>(
    () => ({
      id: faker.string.uuid(),
      email: faker.internet.email(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    }),
    count,
    overrides,
  );
}

export function generateSingleMockUser(overrides?: Partial<User>): User {
  return generateSingleMock<User>(
    () => ({
      id: faker.string.uuid(),
      email: faker.internet.email(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    }),
    overrides,
  );
}
