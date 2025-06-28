import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from 'src/common/exceptions/base-expections.common';

export class CredentialAlreadyExistsForUserException extends BaseHttpException {
  constructor() {
    super(
      {
        message: 'Credential already exists for this user.',
        code: 'CREDENTIAL_ALREADY_EXISTS',
        status: HttpStatus.CONFLICT,
      },
      HttpStatus.CONFLICT,
      'CREDENTIAL_ALREADY_EXISTS',
    );
  }
}

export class CredentialNotFoundException extends BaseHttpException {
  constructor() {
    super(
      {
        message: 'Credential not found.',
        code: 'CREDENTIAL_NOT_FOUND',
        status: HttpStatus.NOT_FOUND,
      },
      HttpStatus.NOT_FOUND,
      'CREDENTIAL_NOT_FOUND',
    );
  }
}
