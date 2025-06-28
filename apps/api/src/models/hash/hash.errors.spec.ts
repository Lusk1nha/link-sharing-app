import { BaseHttpException } from 'src/common/exceptions/base-expections.common';
import {
  GenerateHashHmacException,
  InvalidHashSecretException,
} from './hash.errors';
import { HttpStatus } from '@nestjs/common';

describe(GenerateHashHmacException.name, () => {
  it('should be defined', () => {
    expect(GenerateHashHmacException).toBeDefined();
  });

  it('should be an instance of BaseHttpException', () => {
    const error = new GenerateHashHmacException('Test error');
    expect(error).toBeInstanceOf(BaseHttpException);
  });

  it('should have the correct properties', () => {
    const error = new GenerateHashHmacException('Test error');
    expect(error.getCode()).toBe('HASH_GENERATE_HMAC_ERROR');
    expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});

describe(InvalidHashSecretException.name, () => {
  it('should be defined', () => {
    expect(InvalidHashSecretException).toBeDefined();
  });

  it('should be an instance of BaseHttpException', () => {
    const error = new InvalidHashSecretException();
    expect(error).toBeInstanceOf(BaseHttpException);
  });

  it('should have the correct properties', () => {
    const error = new InvalidHashSecretException();
    expect(error.getCode()).toBe('HASH_INVALID_SECRET');
    expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
  });
});
