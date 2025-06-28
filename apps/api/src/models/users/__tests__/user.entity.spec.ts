import { faker } from '@faker-js/faker/.';
import { UserEntity } from '../domain/user.entity';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';
import { EmailAddressFactory } from 'src/common/entities/email-address/email-address.factory';

describe(UserEntity.name, () => {
  it('should be defined', () => {
    expect(UserEntity).toBeDefined();
  });

  describe('contructor valid data', () => {
    it('should create an instance', () => {
      const id = UUIDFactory.create();
      const email = faker.internet.email();

      const createdAt = faker.date.past();
      const updatedAt = faker.date.recent();

      const user = new UserEntity(
        id,
        EmailAddressFactory.from(email),
        true,
        createdAt,
        updatedAt,
      );
      expect(user).toBeInstanceOf(UserEntity);
      expect(user.id).toEqual(id);
      expect(user.email.value).toEqual(email);

      expect(user.createdAt).toEqual(createdAt);
      expect(user.updatedAt).toEqual(updatedAt);
    });

    it('should create a new user with default values', () => {
      const id = UUIDFactory.create();
      const email = faker.internet.email();

      const user = UserEntity.create(id, EmailAddressFactory.from(email));
      expect(user).toBeInstanceOf(UserEntity);
      expect(user.id).toEqual(id);
      expect(user.email.value).toEqual(email);

      expect(user.createdAt).toBeUndefined();
      expect(user.updatedAt).toBeUndefined();
    });
  });

  describe('contructor invalid data', () => {
    it('should throw an error if id is not a UUID', () => {
      expect(() => {
        new UserEntity(
          'invalid-uuid' as any,
          EmailAddressFactory.from(faker.internet.email()),
        );
      }).toThrow();
    });

    it('should throw an error if email is not a valid email address', () => {
      expect(() => {
        new UserEntity(
          UUIDFactory.create(),
          EmailAddressFactory.from('invalid-email' as any),
        );
      }).toThrow();
    });
  });

  describe('createNew method', () => {
    it(`should be defined ${UserEntity.create.name}`, () => {
      expect(UserEntity.create).toBeDefined();
    });

    it('should create a new user with valid data', () => {
      const id = faker.string.uuid();
      const email = faker.internet.email();

      const user = UserEntity.create(
        UUIDFactory.from(id),
        EmailAddressFactory.from(email),
      );

      expect(user).toBeInstanceOf(UserEntity);
      expect(user.id.value).toEqual(id);
      expect(user.email.value).toEqual(email);
    });
  });
});
