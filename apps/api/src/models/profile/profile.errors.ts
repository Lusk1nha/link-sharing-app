import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from 'src/common/exceptions/base-expections.common';

export class ProfileNotFoundException extends BaseHttpException {
  constructor() {
    super(
      {
        message: 'Profile not found.',
        code: 'PROFILE_NOT_FOUND',
        status: HttpStatus.NOT_FOUND,
      },
      HttpStatus.NOT_FOUND,
      'PROFILE_NOT_FOUND',
    );
  }
}
