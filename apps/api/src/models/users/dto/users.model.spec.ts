import { faker } from "@faker-js/faker/.";

import { UserModel } from "./users.model";
import { UUID } from "src/common/entities/uuid/uuid.entity";

describe("Users Model", () => {
  it("should create a new User instance with valid data", () => {
    const createdAt = new Date();
    const updatedAt = new Date();

    const validData = {
      id: faker.string.uuid(),
      active: faker.datatype.boolean(),
      createdAt,
      updatedAt,
    };

    const user = new UserModel(validData);

    expect(user).toBeInstanceOf(UserModel);
    expect(user.id).toBeInstanceOf(UUID);
    expect(user.id.toString()).toBe(validData.id);
    expect(user.active).toBe(validData.active);
    expect(user.createdAt).toBe(createdAt);
    expect(user.updatedAt).toBe(updatedAt);
  });
});
