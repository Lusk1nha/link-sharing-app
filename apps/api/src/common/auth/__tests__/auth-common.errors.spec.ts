import { HttpStatus } from '@nestjs/common';
import {
  ForbiddenResourceException,
  ImpossibleToGetUserFromRequestException,
  NoTokenProvidedException,
} from '../auth-common.errors';
import { BaseHttpException } from 'src/common/exceptions/base-expections.common';

describe(ForbiddenResourceException.name, () => {
  it('should be defined', () => {
    expect(ForbiddenResourceException).toBeDefined();
  });

  it('should extend BaseHttpException', () => {
    const exception = new ForbiddenResourceException();
    expect(exception).toBeInstanceOf(BaseHttpException);
  });

  it('should have correct default message and code', () => {
    const exception = new ForbiddenResourceException();

    expect(exception.getCode()).toBe('FORBIDDEN_RESOURCE');
    expect(exception.getStatus()).toBe(HttpStatus.FORBIDDEN);
  });
});

describe(NoTokenProvidedException.name, () => {
  it('should be defined', () => {
    expect(NoTokenProvidedException).toBeDefined();
  });

  it('should extend BaseHttpException', () => {
    const exception = new NoTokenProvidedException();
    expect(exception).toBeInstanceOf(BaseHttpException);
  });

  it('should have correct default message and code', () => {
    const exception = new NoTokenProvidedException();

    expect(exception.getCode()).toBe('NO_TOKEN_PROVIDED');
    expect(exception.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
  });
});

describe(ImpossibleToGetUserFromRequestException.name, () => {
  it('should be defined', () => {
    expect(ImpossibleToGetUserFromRequestException).toBeDefined();
  });

  it('should extend BaseHttpException', () => {
    const exception = new ImpossibleToGetUserFromRequestException();
    expect(exception).toBeInstanceOf(BaseHttpException);
  });

  it('should have correct default message and code', () => {
    const exception = new ImpossibleToGetUserFromRequestException();

    expect(exception.getCode()).toBe('IMPOSSIBLE_TO_GET_USER_FROM_REQUEST');
    expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});
