import { Password } from './password.entity';
import {
  InvalidPasswordException,
  WeakPasswordException,
} from './password.errors';

describe(Password.name, () => {
  it('should be defined', () => {
    expect(Password).toBeDefined();
  });

  it('should create an instance with a valid value', () => {
    const passwordValue = 'validPassword123';
    const password = new Password(passwordValue);
    expect(password).toBeInstanceOf(Password);
    expect(password.value).toEqual(passwordValue);
  });

  it('should throw an error for invalid password value', () => {
    const invalidPasswordValue = 'short';
    expect(() => new Password(invalidPasswordValue)).toThrow(
      new WeakPasswordException(),
    );
  });

  it('should throw an error for empty password value', () => {
    const emptyPasswordValue = '';
    expect(() => new Password(emptyPasswordValue)).toThrow(
      new InvalidPasswordException(),
    );
  });
});
