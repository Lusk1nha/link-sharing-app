import { faker } from '@faker-js/faker';
import { Profile } from '@prisma/client';
import {
  generateMock,
  generateSingleMock,
} from '@link-sharing-app/mockup-generator/src/mockup';

export function generateMockProfiles(
  count = 1,
  overrides?: Partial<Profile>,
): Profile[] {
  return generateMock<Profile>(
    () => ({
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      imageUrl: faker.image.avatar(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    }),
    count,
    overrides,
  );
}

export function generateSingleMockProfile(
  overrides?: Partial<Profile>,
): Profile {
  return generateSingleMock<Profile>(
    () => ({
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      imageUrl: faker.image.avatar(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    }),
    overrides,
  );
}
