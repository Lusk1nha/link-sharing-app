import { BaseHttpException } from 'src/common/exceptions/base-expections.common';
import {
  CredentialAlreadyExistsForUserException,
  CredentialNotFoundException,
} from './credentials.errors';
import { HttpStatus } from '@nestjs/common';

describe(CredentialAlreadyExistsForUserException.name, () => {
  it('should be defined', () => {
    expect(CredentialAlreadyExistsForUserException).toBeDefined();
  });

  it('should be an instance of BaseHttpException', () => {
    const exception = new CredentialAlreadyExistsForUserException();
    expect(exception).toBeInstanceOf(BaseHttpException);
  });

  it('should have the correct properties', () => {
    const exception = new CredentialAlreadyExistsForUserException();
    expect(exception.getCode()).toBe('CREDENTIAL_ALREADY_EXISTS');
    expect(exception.getStatus()).toBe(HttpStatus.CONFLICT);
  });
});

describe(CredentialNotFoundException.name, () => {
  it('should be defined', () => {
    expect(CredentialNotFoundException).toBeDefined();
  });

  it('should be an instance of BaseHttpException', () => {
    const exception = new CredentialNotFoundException();
    expect(exception).toBeInstanceOf(BaseHttpException);
  });

  it('should have the correct properties', () => {
    const exception = new CredentialNotFoundException();
    expect(exception.getCode()).toBe('CREDENTIAL_NOT_FOUND');
    expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
  });
});
