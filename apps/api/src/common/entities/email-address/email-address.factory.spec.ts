import { faker } from '@faker-js/faker';
import { EmailAddressFactory } from './email-address.factory';
import { InvalidEmailAddressException } from './email-address.errors';

describe(EmailAddressFactory.name, () => {
  it('should be defined', () => {
    expect(EmailAddressFactory).toBeDefined();
  });

  describe('Using EmailAddressFactory.from', () => {
    it('should create a valid email address', () => {
      const validEmail = faker.internet.email();
      const emailAddress = EmailAddressFactory.from(validEmail);
      expect(emailAddress).toBeDefined();
      expect(emailAddress.value).toBe(validEmail);
    });

    it('should throw an error for an invalid email address', () => {
      const invalidEmail = 'invalid-email';
      expect(() => EmailAddressFactory.from(invalidEmail)).toThrow(
        new InvalidEmailAddressException(),
      );
    });
  });
});
