import { generateSingleMockAdmin } from '../__mock__/admin.mock';
import { AdminEntity } from './admin.entity';
import { AdminMapper } from './admin.mapper';

describe(AdminMapper.name, () => {
  it('should be defined', () => {
    expect(AdminMapper).toBeDefined();
  });

  describe('toDomain', () => {
    it('should be defined', () => {
      expect(AdminMapper.toDomain).toBeDefined();
    });

    it('should convert admin raw to domain entity', () => {
      const raw = generateSingleMockAdmin();
      const entity = AdminMapper.toDomain(raw);

      expect(entity).toBeInstanceOf(AdminEntity);
      expect(entity.id.value).toBe(raw.id);
      expect(entity.userId.value).toBe(raw.userId);
      expect(entity.createdAt).toBeInstanceOf(Date);
      expect(entity.updatedAt).toBeInstanceOf(Date);
    });

    it('should handle optional fields correctly', () => {
      const raw = generateSingleMockAdmin({
        createdAt: undefined,
        updatedAt: undefined,
      });

      const entity = AdminMapper.toDomain(raw);

      expect(entity.createdAt).toBeUndefined();
      expect(entity.updatedAt).toBeUndefined();
    });
  });

  describe('toModel', () => {
    it('should be defined', () => {
      expect(AdminMapper.toModel).toBeDefined();
    });

    it('should convert domain entity to model', () => {
      const raw = generateSingleMockAdmin();
      const entity = AdminMapper.toDomain(raw);
      const model = AdminMapper.toModel(entity);

      expect(model).toEqual({
        id: entity.id.value,
        userId: entity.userId.value,
        createdAt: entity.createdAt ?? null,
        updatedAt: entity.updatedAt ?? null,
      });
    });

    it('should handle optional fields correctly', () => {
      const raw = generateSingleMockAdmin({
        createdAt: undefined,
        updatedAt: undefined,
      });
      const entity = AdminMapper.toDomain(raw);
      const model = AdminMapper.toModel(entity);

      expect(model).toEqual({
        id: entity.id.value,
        userId: entity.userId.value,
        createdAt: null,
        updatedAt: null,
      });
    });
  });
});
