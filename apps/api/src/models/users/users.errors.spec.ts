import { BaseHttpException } from 'src/common/exceptions/base-expections.common';
import {
  UserAlreadyExistsException,
  UserNotFoundException,
} from './users.errors';
import { HttpStatus } from '@nestjs/common';

describe(UserNotFoundException.name, () => {
  it('should be defined', () => {
    expect(UserNotFoundException).toBeDefined();
  });

  it('should be an instance of BaseHttpException', () => {
    const exception = new UserNotFoundException();
    expect(exception).toBeInstanceOf(BaseHttpException);
  });

  it('should have the correct properties', () => {
    const exception = new UserNotFoundException();
    expect(exception.getCode()).toBe('USER_NOT_FOUND');
    expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
  });
});

describe(UserAlreadyExistsException.name, () => {
  it('should be defined', () => {
    expect(UserAlreadyExistsException).toBeDefined();
  });

  it('should be an instance of BaseHttpException', () => {
    const exception = new UserAlreadyExistsException();
    expect(exception).toBeInstanceOf(BaseHttpException);
  });

  it('should have the correct properties', () => {
    const exception = new UserAlreadyExistsException();
    expect(exception.getCode()).toBe('USER_ALREADY_EXISTS');
    expect(exception.getStatus()).toBe(HttpStatus.CONFLICT);
  });
});
