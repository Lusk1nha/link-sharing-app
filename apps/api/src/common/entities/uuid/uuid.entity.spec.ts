import { UUID } from './uuid.entity';
import { InvalidUuidException } from './uuid.errors';

describe(UUID.name, () => {
  it('should be defined', () => {
    expect(UUID).toBeDefined();
  });

  describe('Valid UUIDs', () => {
    it('should create a valid UUID', () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      const uuid = new UUID(validUUID);
      expect(uuid).toBeDefined();
      expect(uuid.value).toBe(validUUID);
    });
  });

  describe('Invalid UUIDs', () => {
    it('should throw an error for an invalid UUID', () => {
      const invalidUUID = 'invalid-uuid';
      expect(() => new UUID(invalidUUID)).toThrow(new InvalidUuidException());
    });

    it('should throw an error for a non-string UUID', () => {
      expect(() => new UUID(123 as any)).toThrow(new InvalidUuidException());
    });

    it('should throw an error for an empty UUID', () => {
      expect(() => new UUID('')).toThrow(new InvalidUuidException());
    });
  });
});
