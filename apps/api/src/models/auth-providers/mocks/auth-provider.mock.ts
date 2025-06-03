import { faker } from "@faker-js/faker/.";
import { AuthProviderDto, AuthProviderType } from "../dto/auth-provider.model";
import { MockUtils } from "@link-sharing-app/mockup-generator/src/utils";

const mockAuthProviderTypes = [
  "CREDENTIALS",
  "GITHUB",
  "GOOGLE",
] as AuthProviderType[];

function createAuthProviderMockFactory(): AuthProviderDto {
  const createdAt = faker.date.past();

  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    type: faker.helpers.arrayElement(mockAuthProviderTypes),
    createdAt,
  };
}

export function generateAuthProviderMock(length = 0): AuthProviderDto[] {
  return MockUtils.generateMany(createAuthProviderMockFactory, length);
}

export function generateOneAuthProviderMock(): AuthProviderDto {
  return generateAuthProviderMock(1)[0];
}
