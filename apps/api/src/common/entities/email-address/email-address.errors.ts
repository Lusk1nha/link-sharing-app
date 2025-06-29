import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from 'src/common/exceptions/base-expections.common';

export class InvalidEmailAddressException extends BaseHttpException {
  constructor() {
    super(
      {
        message: 'Invalid email address format.',
        code: 'INVALID_EMAIL_ADDRESS',
        status: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
      'INVALID_EMAIL_ADDRESS',
    );
  }
}

export class EmptyEmailAddressException extends BaseHttpException {
  constructor() {
    super(
      {
        message: 'Email address cannot be empty.',
        code: 'EMPTY_EMAIL_ADDRESS',
        status: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
      'EMPTY_EMAIL_ADDRESS',
    );
  }
}
