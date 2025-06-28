import { faker } from '@faker-js/faker/.';
import { CredentialEntity } from './credential.entity';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';

describe(CredentialEntity.name, () => {
  it('should be defined', () => {
    expect(CredentialEntity).toBeDefined();
  });

  describe('constructor with valid data', () => {
    it('should create a new credential with valid data', () => {
      const id = faker.string.uuid();
      const userId = faker.string.uuid();
      const passwordHash = faker.string.alphanumeric(64);
      const createdAt = faker.date.past();
      const updatedAt = faker.date.recent();

      const credential = new CredentialEntity(
        UUIDFactory.from(id),
        UUIDFactory.from(userId),
        passwordHash,
        createdAt,
        updatedAt,
      );

      expect(credential).toBeInstanceOf(CredentialEntity);
      expect(credential.id.value).toEqual(id);
      expect(credential.userId.value).toEqual(userId);
      expect(credential.passwordHash).toEqual(passwordHash);
      expect(credential.createdAt).toEqual(createdAt);
      expect(credential.updatedAt).toEqual(updatedAt);
    });
  });

  describe('constructor with invalid data', () => {
    it('should throw an error if id is not a UUID', () => {
      expect(() => {
        new CredentialEntity(
          'invalid-uuid' as any,
          UUIDFactory.create(),
          faker.string.alphanumeric(64),
        );
      }).toThrow();
    });

    it('should throw an error if userId is not a UUID', () => {
      expect(() => {
        new CredentialEntity(
          UUIDFactory.create(),
          'invalid-uuid' as any,
          faker.string.alphanumeric(64),
        );
      }).toThrow();
    });
  });

  describe('createNew method', () => {
    it(`should be defined ${CredentialEntity.create.name}`, () => {
      expect(CredentialEntity.create).toBeDefined();
    });

    it('should create a new credential with valid data', () => {
      const id = faker.string.uuid();
      const userId = faker.string.uuid();
      const passwordHash = faker.string.alphanumeric(64);

      const credential = CredentialEntity.create(
        UUIDFactory.from(id),
        UUIDFactory.from(userId),
        passwordHash,
      );

      expect(credential).toBeInstanceOf(CredentialEntity);
      expect(credential.id.value).toEqual(id);
      expect(credential.userId.value).toEqual(userId);
      expect(credential.passwordHash).toEqual(passwordHash);
    });
  });
});
