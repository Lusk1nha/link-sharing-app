import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from 'src/common/exceptions/base-expections.common';

export class AuthProviderAlreadyExistsException extends BaseHttpException {
  constructor() {
    super(
      {
        message: 'Auth provider with this provider ID already exists',
        code: 'AUTH_PROVIDER_ALREADY_EXISTS',
        status: HttpStatus.CONFLICT,
      },
      HttpStatus.CONFLICT,
      'AUTH_PROVIDER_ALREADY_EXISTS',
    );
  }
}

export class AuthProviderNotFoundForUserException extends BaseHttpException {
  constructor() {
    super(
      {
        message: 'No auth providers found for the specified user',
        code: 'AUTH_PROVIDER_NOT_FOUND_FOR_USER',
        status: HttpStatus.NOT_FOUND,
      },
      HttpStatus.NOT_FOUND,
      'AUTH_PROVIDER_NOT_FOUND_FOR_USER',
    );
  }
}
