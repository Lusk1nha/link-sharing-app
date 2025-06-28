import { BaseHttpException } from 'src/common/exceptions/base-expections.common';
import { InvalidUuidException } from './uuid.errors';
import { HttpStatus } from '@nestjs/common';

describe(InvalidUuidException.name, () => {
  it('should be defined', () => {
    expect(InvalidUuidException).toBeDefined();
  });

  it('should be an instance of BaseHttpException', () => {
    const exception = new InvalidUuidException();
    expect(exception).toBeInstanceOf(BaseHttpException);
  });

  it('should have the correct properties', () => {
    const exception = new InvalidUuidException();
    expect(exception.getCode()).toBe('INVALID_UUID');
    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
  });
});
