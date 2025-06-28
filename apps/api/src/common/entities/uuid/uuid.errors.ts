import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from 'src/common/exceptions/base-expections.common';

export class InvalidUuidException extends BaseHttpException {
  constructor(error?: string) {
    super(
      {
        message: error || 'Invalid UUID format.',
        code: 'INVALID_UUID',
        status: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
      'INVALID_UUID',
    );
  }
}
