import { faker } from "@faker-js/faker/.";
import { UUID } from "./uuid.entity";
import { UUIDFactory } from "./uuid.factory";

describe("UUIDFactory", () => {
  it("should create a new UUID instance", () => {
    const uuid = UUIDFactory.create();
    expect(uuid).toBeInstanceOf(UUID);
    expect(UUID.isValid(uuid.toString())).toBe(true);
  });

  it("should create a UUID instance from a valid UUID string", () => {
    const validUUID = faker.string.uuid();
    const uuid = UUIDFactory.from(validUUID);
    expect(uuid).toBeInstanceOf(UUID);
    expect(uuid.toString()).toBe(validUUID);
  });

  it("should throw an error when creating a UUID from an invalid string", () => {
    const invalidUUID = "invalid-uuid-format";
    expect(() => UUIDFactory.from(invalidUUID)).toThrow(
      `Invalid UUID format: "${invalidUUID}"`,
    );
  });

  it("should compare two equal UUIDs as equal", () => {
    const id = faker.string.uuid();
    const uuid1 = new UUID(id);
    const uuid2 = new UUID(id);
    expect(uuid1.equals(uuid2)).toBe(true);
  });

  it("should compare two different UUIDs as not equal", () => {
    const uuid1 = UUIDFactory.create();
    const uuid2 = UUIDFactory.create();
    expect(uuid1.equals(uuid2)).toBe(false);
  });
});
