import { BaseHttpException } from 'src/common/exceptions/base-expections.common';
import {
  GeneratingTokenException,
  InvalidTokenException,
  InvalidTokenTypeException,
  TokenSecretMissingException,
} from './token.errors';
import { HttpStatus } from '@nestjs/common';

describe(InvalidTokenException.name, () => {
  it('should be defined', () => {
    expect(InvalidTokenException).toBeDefined();
  });

  it('should create an instance of BaseHttpException', () => {
    const exception = new InvalidTokenException();
    expect(exception).toBeInstanceOf(BaseHttpException);
  });

  it('should have the correct properties', () => {
    const exception = new InvalidTokenException();
    expect(exception.getCode()).toBe('INVALID_TOKEN');
    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
  });
});

describe(InvalidTokenTypeException.name, () => {
  it('should be defined', () => {
    expect(InvalidTokenTypeException).toBeDefined();
  });

  it('should create an instance of BaseHttpException', () => {
    const type = 'invalid-type';
    const exception = new InvalidTokenTypeException(type);
    expect(exception).toBeInstanceOf(BaseHttpException);
  });

  it('should have the correct properties', () => {
    const type = 'invalid-type';
    const exception = new InvalidTokenTypeException(type);
    expect(exception.getCode()).toBe('INVALID_TOKEN_TYPE');
    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    expect(exception.message).toContain(type);
  });
});

describe(TokenSecretMissingException.name, () => {
  it('should be defined', () => {
    expect(TokenSecretMissingException).toBeDefined();
  });

  it('should create an instance of BaseHttpException', () => {
    const key = 'test-key';
    const exception = new TokenSecretMissingException(key);
    expect(exception).toBeInstanceOf(BaseHttpException);
  });

  it('should have the correct properties', () => {
    const key = 'test-key';
    const exception = new TokenSecretMissingException(key);
    expect(exception.getCode()).toBe('TOKEN_SECRET_MISSING');
    expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(exception.message).toContain(key);
  });
});

describe(GeneratingTokenException.name, () => {
  it('should be defined', () => {
    expect(GeneratingTokenException).toBeDefined();
  });

  it('should create an instance of BaseHttpException', () => {
    const exception = new GeneratingTokenException();
    expect(exception).toBeInstanceOf(BaseHttpException);
  });

  it('should have the correct properties', () => {
    const exception = new GeneratingTokenException();
    expect(exception.getCode()).toBe('GENERATING_TOKEN_ERROR');
    expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});
