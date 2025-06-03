import { faker } from "@faker-js/faker/.";
import { UserDto } from "../dto/users.model";
import { MockUtils } from "@link-sharing-app/mockup-generator/src/utils";

function createUserMockFactory(): UserDto {
  const updatedAt = faker.date.recent();
  const createdAt = faker.date.past({
    refDate: updatedAt,
    years: 1,
  });

  return {
    id: faker.string.uuid(),
    active: faker.datatype.boolean(),
    createdAt,
    updatedAt,
  };
}

export function generateUserMock(length = 0): UserDto[] {
  return MockUtils.generateMany(createUserMockFactory, length);
}

export function generateOneUserMock(): UserDto {
  return generateUserMock(1)[0];
}
