import { BaseHttpException } from 'src/common/exceptions/base-expections.common';
import {
  InvalidPasswordException,
  WeakPasswordException,
} from './password.errors';
import { HttpStatus } from '@nestjs/common';

describe(InvalidPasswordException.name, () => {
  it('should be defined', () => {
    expect(InvalidPasswordException).toBeDefined();
  });

  it('should be an instance of BaseHttpException', () => {
    const exception = new InvalidPasswordException();
    expect(exception).toBeInstanceOf(BaseHttpException);
  });

  it('should have the correct properties', () => {
    const exception = new InvalidPasswordException();
    expect(exception.getCode()).toBe('INVALID_PASSWORD');
    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
  });
});

describe(WeakPasswordException.name, () => {
  it('should be defined', () => {
    expect(WeakPasswordException).toBeDefined();
  });

  it('should be an instance of BaseHttpException', () => {
    const exception = new WeakPasswordException();
    expect(exception).toBeInstanceOf(BaseHttpException);
  });

  it('should have the correct properties', () => {
    const exception = new WeakPasswordException();
    expect(exception.getCode()).toBe('WEAK_PASSWORD');
    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
  });
});
