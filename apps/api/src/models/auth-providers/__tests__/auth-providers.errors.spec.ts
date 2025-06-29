import { BaseHttpException } from 'src/common/exceptions/base-expections.common';
import {
  AuthProviderAlreadyExistsException,
  AuthProviderNotFoundForUserException,
} from '../auth-providers.errors';
import { HttpStatus } from '@nestjs/common';

describe(AuthProviderAlreadyExistsException.name, () => {
  it('it should be defined', () => {
    expect(new AuthProviderAlreadyExistsException()).toBeDefined();
  });

  it('should be an instance of BaseHttpException', () => {
    const exception = new AuthProviderAlreadyExistsException();
    expect(exception).toBeInstanceOf(BaseHttpException);
  });

  it('should have the correct properties', () => {
    const exception = new AuthProviderAlreadyExistsException();
    expect(exception.getCode()).toBe('AUTH_PROVIDER_ALREADY_EXISTS');
    expect(exception.getStatus()).toBe(HttpStatus.CONFLICT);
  });
});

describe(AuthProviderNotFoundForUserException.name, () => {
  it('it should be defined', () => {
    expect(new AuthProviderNotFoundForUserException()).toBeDefined();
  });

  it('should be an instance of BaseHttpException', () => {
    const exception = new AuthProviderNotFoundForUserException();
    expect(exception).toBeInstanceOf(BaseHttpException);
  });

  it('should have the correct properties', () => {
    const exception = new AuthProviderNotFoundForUserException();
    expect(exception.getCode()).toBe('AUTH_PROVIDER_NOT_FOUND_FOR_USER');
    expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
  });
});
