import { faker } from '@faker-js/faker/.';
import { Admin } from '@prisma/client';
import {
  generateMock,
  generateSingleMock,
} from '@link-sharing-app/mockup-generator/src/mockup';

export function generateMockAdmins(
  count = 1,
  overrides?: Partial<Admin>,
): Admin[] {
  return generateMock<Admin>(
    () => ({
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    }),
    count,
    overrides,
  );
}

export function generateSingleMockAdmin(overrides?: Partial<Admin>): Admin {
  return generateSingleMock<Admin>(
    () => ({
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    }),
    overrides,
  );
}
