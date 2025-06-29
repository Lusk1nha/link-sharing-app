import { faker } from '@faker-js/faker/.';
import { AuthProviderEntity } from '../domain/auth-providers.entity';
import { AuthSignInType } from '@prisma/client';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';

describe(AuthProviderEntity.name, () => {
  it('should be defined', () => {
    expect(AuthProviderEntity).toBeDefined();
  });

  describe('constructor valid data', () => {
    it('should create a new auth provider with valid data', () => {
      const id = faker.string.uuid();
      const userId = faker.string.uuid();
      const provider = faker.helpers.enumValue(AuthSignInType);
      const providerId = faker.string.uuid();
      const createdAt = faker.date.past();
      const updatedAt = faker.date.recent();

      const authProvider = new AuthProviderEntity(
        UUIDFactory.from(id),
        UUIDFactory.from(userId),
        provider,
        providerId,
        createdAt,
        updatedAt,
      );

      expect(authProvider).toBeInstanceOf(AuthProviderEntity);
      expect(authProvider.id.value).toEqual(id);
      expect(authProvider.userId.value).toEqual(userId);
      expect(authProvider.providerType).toEqual(provider);
      expect(authProvider.providerId).toEqual(providerId);
      expect(authProvider.createdAt).toEqual(createdAt);
      expect(authProvider.updatedAt).toEqual(updatedAt);
    });
  });

  describe('constructor invalid data', () => {
    it('should throw an error if id is not a UUID', () => {
      expect(() => {
        new AuthProviderEntity(
          'invalid-uuid' as any,
          UUIDFactory.create(),
          faker.helpers.enumValue(AuthSignInType),
          faker.string.uuid(),
        );
      }).toThrow();
    });

    it('should throw an error if userId is not a UUID', () => {
      expect(() => {
        new AuthProviderEntity(
          UUIDFactory.create(),
          'invalid-uuid' as any,
          faker.helpers.enumValue(AuthSignInType),
          faker.string.uuid(),
        );
      }).toThrow();
    });
  });

  describe('createNew method', () => {
    it(`should be defined ${AuthProviderEntity.create.name}`, () => {
      expect(AuthProviderEntity.create).toBeDefined();
    });

    it('should create a new auth provider with valid data', () => {
      const id = faker.string.uuid();
      const userId = faker.string.uuid();
      const provider = faker.helpers.enumValue(AuthSignInType);
      const providerId = faker.string.uuid();

      const authProvider = AuthProviderEntity.create(
        UUIDFactory.from(id),
        UUIDFactory.from(userId),
        provider,
        providerId,
      );

      expect(authProvider).toBeInstanceOf(AuthProviderEntity);
      expect(authProvider.id.value).toEqual(id);
      expect(authProvider.userId.value).toEqual(userId);
      expect(authProvider.providerType).toEqual(provider);
      expect(authProvider.providerId).toEqual(providerId);
    });
  });
});
