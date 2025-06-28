import { BaseHttpException } from 'src/common/exceptions/base-expections.common';
import {
  LoginCredentialsInvalidException,
  NoRefreshTokenProvidedException,
} from './auth.errors';
import { HttpStatus } from '@nestjs/common';

describe(LoginCredentialsInvalidException.name, () => {
  it('should be defined', () => {
    expect(LoginCredentialsInvalidException).toBeDefined();
  });

  it('should be an instance of BaseHttpException', () => {
    const exception = new LoginCredentialsInvalidException();
    expect(exception).toBeInstanceOf(BaseHttpException);
  });

  it('should have the correct properties', () => {
    const exception = new LoginCredentialsInvalidException();
    expect(exception.getCode()).toBe('LOGIN_CREDENTIALS_INVALID');
    expect(exception.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
  });
});

describe(NoRefreshTokenProvidedException.name, () => {
  it('should be defined', () => {
    expect(NoRefreshTokenProvidedException).toBeDefined();
  });

  it('should be an instance of BaseHttpException', () => {
    const exception = new NoRefreshTokenProvidedException();
    expect(exception).toBeInstanceOf(BaseHttpException);
  });

  it('should have the correct properties', () => {
    const exception = new NoRefreshTokenProvidedException();
    expect(exception.getCode()).toBe('NO_REFRESH_TOKEN_PROVIDED');
    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
  });
});
