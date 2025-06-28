import { AdminEntity } from './admin.entity';
import { generateSingleMockAdmin } from '../__mock__/admin.mock';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';
import { InvalidUuidException } from 'src/common/entities/uuid/uuid.errors';

describe(AdminEntity.name, () => {
  it('should be defined', () => {
    expect(AdminEntity).toBeDefined();
  });

  describe('valid data', () => {
    it('should create an instance with valid parameters', () => {
      const raw = generateSingleMockAdmin();
      const entity = new AdminEntity(
        UUIDFactory.from(raw.id),
        UUIDFactory.from(raw.userId),
        raw.createdAt,
        raw.updatedAt,
      );

      expect(entity).toBeInstanceOf(AdminEntity);
      expect(entity.id.value).toBe(raw.id);
      expect(entity.userId.value).toBe(raw.userId);
      expect(entity.createdAt).toBeInstanceOf(Date);
      expect(entity.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a new admin entity with static method', () => {
      const raw = generateSingleMockAdmin();
      const entity = AdminEntity.createNew(
        UUIDFactory.from(raw.id),
        UUIDFactory.from(raw.userId),
      );

      expect(entity).toBeInstanceOf(AdminEntity);
      expect(entity.id.value).toBe(raw.id);
      expect(entity.userId.value).toBe(raw.userId);
    });
  });

  describe('invalid data', () => {
    it('should throw InvalidUuidException for invalid ID', () => {
      expect(() => {
        new AdminEntity(
          'invalid-uuid' as any,
          UUIDFactory.from(generateSingleMockAdmin().userId),
        );
      }).toThrow(new InvalidUuidException('Invalid admin ID format.'));
    });

    it('should throw InvalidUuidException for invalid user ID', () => {
      expect(() => {
        new AdminEntity(
          UUIDFactory.from(generateSingleMockAdmin().id),
          'invalid-uuid' as any,
        );
      }).toThrow(new InvalidUuidException('Invalid user ID format.'));
    });
  });
});
