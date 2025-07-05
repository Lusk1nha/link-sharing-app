import { BaseHttpException } from 'src/common/exceptions/base-expections.common';
import { ProfileNotFoundException } from '../profile.errors';
import { HttpStatus } from '@nestjs/common';

describe(ProfileNotFoundException.name, () => {
  it('should be defined', () => {
    expect(ProfileNotFoundException).toBeDefined();
  });

  it('should extend the base exception class', () => {
    const exception = new ProfileNotFoundException();
    expect(exception).toBeInstanceOf(BaseHttpException);
  });

  it('should have a default message', () => {
    const exception = new ProfileNotFoundException();
    expect(exception.getStatus()).toEqual(HttpStatus.NOT_FOUND);
    expect(exception.getCode()).toEqual('PROFILE_NOT_FOUND');
  });
});
