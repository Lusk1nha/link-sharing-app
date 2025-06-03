import { faker } from "@faker-js/faker/.";

import { CredentialModel } from "./credentials.model";
import { UUID } from "src/common/entities/uuid/uuid.entity";

describe("CredentialModel", () => {
  it("should create a valid CredentialModel", () => {
    const updatedAt = faker.date.recent();
    const createdAt = faker.date.past({ refDate: updatedAt });

    const validData = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      email: faker.internet.email(),
      passwordHash: faker.string.alphanumeric(64),
      createdAt,
      updatedAt,
    };

    const credential = new CredentialModel(validData);

    expect(credential).toBeInstanceOf(CredentialModel);
    expect(credential.id).toBeInstanceOf(UUID);
    expect(credential.userId).toBeInstanceOf(UUID);
    expect(credential.id.toString()).toBe(validData.id);
    expect(credential.userId.toString()).toBe(validData.userId);
    expect(credential.createdAt).toBe(createdAt);
    expect(credential.updatedAt).toBe(updatedAt);
  });
});
