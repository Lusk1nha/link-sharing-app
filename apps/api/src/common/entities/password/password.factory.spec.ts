import { faker } from '@faker-js/faker/.';
import { Password } from './password.entity';
import { InvalidPasswordException } from './password.errors';
import { PasswordFactory } from './password.factory';

describe(PasswordFactory.name, () => {
  describe('From method', () => {
    it(`should be defined ${PasswordFactory.from.name}`, () => {
      expect(PasswordFactory.from).toBeDefined();
    });

    it('should create a Password instance from a string', () => {
      const passwordValue = faker.string.alphanumeric(10);
      const password = PasswordFactory.from(passwordValue);
      expect(password).toBeInstanceOf(Password);
      expect(password.value).toEqual(passwordValue);
    });

    it('should error if the value is not a string', () => {
      const invalidValue = 12345;
      expect(() =>
        PasswordFactory.from(invalidValue as unknown as string),
      ).toThrow(new InvalidPasswordException());
    });
  });
});
