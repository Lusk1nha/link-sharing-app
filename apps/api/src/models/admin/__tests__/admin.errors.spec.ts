import { BaseHttpException } from 'src/common/exceptions/base-expections.common';
import {
  AdminAlreadyExistsException,
  AdminNotFoundException,
} from '../admin.errors';
import { HttpStatus } from '@nestjs/common';

describe(AdminNotFoundException.name, () => {
  it('should be defined', () => {
    expect(AdminNotFoundException).toBeDefined();
  });

  it('should be an instance of BaseHttpException', () => {
    const exception = new AdminNotFoundException();
    expect(exception).toBeInstanceOf(BaseHttpException);
  });

  it('should have the correct properties', () => {
    const exception = new AdminNotFoundException();

    expect(exception.getCode()).toBe('ADMIN_NOT_FOUND');
    expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
  });
});

describe(AdminAlreadyExistsException.name, () => {
  it('should be defined', () => {
    expect(AdminAlreadyExistsException).toBeDefined();
  });

  it('should be an instance of BaseHttpException', () => {
    const exception = new AdminAlreadyExistsException();
    expect(exception).toBeInstanceOf(BaseHttpException);
  });

  it('should have the correct properties', () => {
    const exception = new AdminAlreadyExistsException();
    expect(exception.getCode()).toBe('ADMIN_ALREADY_EXISTS');
    expect(exception.getStatus()).toBe(HttpStatus.CONFLICT);
  });
});
