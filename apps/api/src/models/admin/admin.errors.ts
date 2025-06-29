import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from 'src/common/exceptions/base-expections.common';

export class AdminNotFoundException extends BaseHttpException {
  constructor() {
    super(
      {
        message: 'Admin not found.',
        code: 'ADMIN_NOT_FOUND',
        status: HttpStatus.NOT_FOUND,
      },
      HttpStatus.NOT_FOUND,
      'ADMIN_NOT_FOUND',
    );
  }
}

export class AdminAlreadyExistsException extends BaseHttpException {
  constructor() {
    super(
      {
        message: 'Admin already exists.',
        code: 'ADMIN_ALREADY_EXISTS',
        status: HttpStatus.CONFLICT,
      },
      HttpStatus.CONFLICT,
      'ADMIN_ALREADY_EXISTS',
    );
  }
}
