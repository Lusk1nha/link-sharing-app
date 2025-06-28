import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from 'src/common/exceptions/base-expections.common';
import {
  PasswordComparisonException,
  PasswordHashingException,
} from './password.errors';

describe(PasswordHashingException.name, () => {
  it('should be defined', () => {
    expect(PasswordHashingException).toBeDefined();
  });

  it('should be an instance of BaseHttpException', () => {
    const exception = new PasswordHashingException('Error hashing password');
    expect(exception).toBeInstanceOf(BaseHttpException);
  });

  it('should have the correct properties', () => {
    const exception = new PasswordHashingException('Error hashing password');

    expect(exception.getCode()).toBe('PASSWORD_HASHING_ERROR');
    expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});

describe(PasswordComparisonException.name, () => {
  it('should be defined', () => {
    expect(PasswordComparisonException).toBeDefined();
  });

  it('should be an instance of BaseHttpException', () => {
    const exception = new PasswordComparisonException(
      'Error comparing password',
    );
    expect(exception).toBeInstanceOf(BaseHttpException);
  });

  it('should have the correct properties', () => {
    const exception = new PasswordComparisonException(
      'Error comparing password',
    );

    expect(exception.getCode()).toBe('PASSWORD_COMPARISON_ERROR');
    expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});
