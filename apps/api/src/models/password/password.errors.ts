import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from 'src/common/exceptions/base-expections.common';

export class PasswordHashingException extends BaseHttpException {
  constructor(error: string) {
    super(
      {
        message: 'An error occurred while hashing the password.',
        cause: error,
        code: 'PASSWORD_HASHING_ERROR',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
      'PASSWORD_HASHING_ERROR',
    );
  }
}

export class PasswordComparisonException extends BaseHttpException {
  constructor(error: string) {
    super(
      {
        message: 'An error occurred while comparing the password.',
        cause: error,
        code: 'PASSWORD_COMPARISON_ERROR',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
      'PASSWORD_COMPARISON_ERROR',
    );
  }
}
