import { faker } from "@faker-js/faker/.";
import { UUID } from "./uuid.entity";

describe("UUID Entity", () => {
  it("should create a new UUID instance with a valid UUID", () => {
    const validUUID = faker.string.uuid();
    const uuid = new UUID(validUUID);
    expect(uuid).toBeInstanceOf(UUID);
    expect(uuid.toString()).toBe(validUUID);
  });

  it("should generate a new UUID instance when no value is provided", () => {
    const uuid = UUID.generate();
    expect(UUID.isValid(uuid.toString())).toBe(true);
  });

  it("should throw an error for an invalid UUID", () => {
    const invalidUUID = "invalid-uuid-format";
    expect(() => new UUID(invalidUUID)).toThrow(
      `Invalid UUID format: "${invalidUUID}"`,
    );
  });
});
