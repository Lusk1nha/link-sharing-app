import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from 'src/common/exceptions/base-expections.common';

export class GenerateHashHmacException extends BaseHttpException {
  constructor(error: string) {
    super(
      {
        message: 'Error generating HMAC hash.',
        code: 'HASH_GENERATE_HMAC_ERROR',
        cause: error,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
      'HASH_GENERATE_HMAC_ERROR',
    );
  }
}

export class InvalidHashSecretException extends BaseHttpException {
  constructor() {
    super(
      {
        message: 'Invalid hash secret provided.',
        code: 'HASH_INVALID_SECRET',
        status: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
      'HASH_INVALID_SECRET',
    );
  }
}
