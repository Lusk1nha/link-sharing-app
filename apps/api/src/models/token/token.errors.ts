import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from 'src/common/exceptions/base-expections.common';

export class InvalidTokenException extends BaseHttpException {
  constructor() {
    super(
      {
        message: 'Invalid token provided.',
        code: 'INVALID_TOKEN',
        status: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
      'INVALID_TOKEN',
    );
  }
}

export class InvalidTokenTypeException extends BaseHttpException {
  constructor(type: string) {
    super(
      {
        message: 'Invalid token type provided:' + type,
        code: 'INVALID_TOKEN_TYPE',
        status: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
      'INVALID_TOKEN_TYPE',
    );
  }
}

export class TokenSecretMissingException extends BaseHttpException {
  constructor(key: string) {
    super(
      {
        message: `Token secret for key ${key} is missing.`,
        code: 'TOKEN_SECRET_MISSING',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
      'TOKEN_SECRET_MISSING',
    );
  }
}

export class GeneratingTokenException extends BaseHttpException {
  constructor(message?: string) {
    super(
      {
        message: 'Error generating token.' + (message ? ` ${message}` : ''),
        code: 'GENERATING_TOKEN_ERROR',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
      'GENERATING_TOKEN_ERROR',
    );
  }
}
