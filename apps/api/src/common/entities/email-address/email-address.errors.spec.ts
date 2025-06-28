import { BaseHttpException } from 'src/common/exceptions/base-expections.common';
import {
  EmptyEmailAddressException,
  InvalidEmailAddressException,
} from './email-address.errors';
import { HttpStatus } from '@nestjs/common';

describe(InvalidEmailAddressException.name, () => {
  it('should be defined', () => {
    expect(InvalidEmailAddressException).toBeDefined();
  });

  it('should be an instance of BaseHttpException', () => {
    const exception = new InvalidEmailAddressException();
    expect(exception).toBeInstanceOf(BaseHttpException);
  });

  it('should have the correct properties', () => {
    const exception = new InvalidEmailAddressException();
    expect(exception.getCode()).toBe('INVALID_EMAIL_ADDRESS');
    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
  });
});

describe(EmptyEmailAddressException.name, () => {
  it('should be defined', () => {
    expect(EmptyEmailAddressException).toBeDefined();
  });

  it('should be an instance of BaseHttpException', () => {
    const exception = new EmptyEmailAddressException();
    expect(exception).toBeInstanceOf(BaseHttpException);
  });

  it('should have the correct properties', () => {
    const exception = new EmptyEmailAddressException();
    expect(exception.getCode()).toBe('EMPTY_EMAIL_ADDRESS');
    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
  });
});
