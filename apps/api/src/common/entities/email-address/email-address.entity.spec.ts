import { faker } from '@faker-js/faker';
import { EmailAddress } from './email-address.entity';
import {
  EmptyEmailAddressException,
  InvalidEmailAddressException,
} from './email-address.errors';

describe(EmailAddress.name, () => {
  it('should be defined', () => {
    expect(EmailAddress).toBeDefined();
  });

  describe('Valid email addresses', () => {
    it('should create a valid email address', () => {
      const validEmail = faker.internet.email();
      const emailAddress = new EmailAddress(validEmail);
      expect(emailAddress).toBeDefined();
      expect(emailAddress.value).toBe(validEmail);
    });
  });

  describe('Invalid email addresses', () => {
    it('should throw an error for an invalid email address', () => {
      const invalidEmail = 'invalid-email';
      expect(() => new EmailAddress(invalidEmail)).toThrow(
        new InvalidEmailAddressException(),
      );
    });

    it('should throw an error for a non-string email address', () => {
      expect(() => new EmailAddress(123 as any)).toThrow(
        new InvalidEmailAddressException(),
      );
    });

    it('should throw an error for an empty email address', () => {
      expect(() => new EmailAddress('')).toThrow(
        new EmptyEmailAddressException(),
      );
    });
  });
});
