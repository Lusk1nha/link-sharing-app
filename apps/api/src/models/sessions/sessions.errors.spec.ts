import { HttpStatus } from '@nestjs/common';
import {
  GeneratingSessionException,
  InvalidSessionException,
  SessionEnvironmentKeyNotFoundException,
} from './sessions.errors';
import { BaseHttpException } from 'src/common/exceptions/base-expections.common';

describe(SessionEnvironmentKeyNotFoundException.name, () => {
  it('should be defined', () => {
    expect(SessionEnvironmentKeyNotFoundException).toBeDefined();
  });

  it('should be an instance of BaseHttpException', () => {
    const error = new SessionEnvironmentKeyNotFoundException(
      'SESSION_TOKEN_SECRET',
    );
    expect(error).toBeInstanceOf(BaseHttpException);
  });

  it('should have the correct properties', () => {
    const error = new SessionEnvironmentKeyNotFoundException(
      'SESSION_TOKEN_SECRET',
    );
    expect(error.getCode()).toBe('SESSION_ENVIRONMENT_KEY_NOT_FOUND');
    expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});

describe(GeneratingSessionException.name, () => {
  it('should be defined', () => {
    expect(GeneratingSessionException).toBeDefined();
  });

  it('should be an instance of BaseHttpException', () => {
    const error = new GeneratingSessionException();
    expect(error).toBeInstanceOf(BaseHttpException);
  });

  it('should have the correct properties', () => {
    const error = new GeneratingSessionException();
    expect(error.getCode()).toBe('GENERATING_SESSION_ERROR');
    expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});

describe(InvalidSessionException.name, () => {
  it('should be defined', () => {
    expect(InvalidSessionException).toBeDefined();
  });

  it('should be an instance of BaseHttpException', () => {
    const error = new InvalidSessionException();
    expect(error).toBeInstanceOf(BaseHttpException);
  });

  it('should have the correct properties', () => {
    const error = new InvalidSessionException();
    expect(error.getCode()).toBe('INVALID_SESSION');
    expect(error.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
  });
});
