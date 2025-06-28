import { faker } from '@faker-js/faker';
import { UUIDFactory } from './uuid.factory';
import { InvalidUuidException } from './uuid.errors';
import { UUID } from './uuid.entity';

describe(UUIDFactory.name, () => {
  it('should be defined', () => {
    expect(UUIDFactory).toBeDefined();
  });

  describe('Using UUIDFactory.from', () => {
    it('should create a valid UUID', () => {
      const validUUID = faker.string.uuid();
      const uuid = UUIDFactory.from(validUUID);
      expect(uuid).toBeDefined();
      expect(uuid.value).toBe(validUUID);
    });

    it('should throw an error for an invalid UUID', () => {
      const invalidUUID = 'invalid-uuid';
      expect(() => UUIDFactory.from(invalidUUID)).toThrow(
        new InvalidUuidException(),
      );
    });
  });

  describe('Using UUIDFactory.create', () => {
    it('should create a valid UUID', () => {
      const uuid = UUIDFactory.create();
      expect(uuid).toBeDefined();
      expect(UUID.isValid(uuid.value)).toBe(true);
    });
  });
});
