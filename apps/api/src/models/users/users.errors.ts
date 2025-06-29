import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from 'src/common/exceptions/base-expections.common';

export class UserNotFoundException extends BaseHttpException {
  constructor() {
    super(
      {
        message: 'User not found.',
        code: 'USER_NOT_FOUND',
        status: HttpStatus.NOT_FOUND,
      },
      HttpStatus.NOT_FOUND,
      'USER_NOT_FOUND',
    );
  }
}

export class UserAlreadyExistsException extends BaseHttpException {
  constructor() {
    super(
      {
        message: 'User with email address already exists',
        code: 'USER_ALREADY_EXISTS',
        status: HttpStatus.CONFLICT,
      },
      HttpStatus.CONFLICT,
      'USER_ALREADY_EXISTS',
    );
  }
}
