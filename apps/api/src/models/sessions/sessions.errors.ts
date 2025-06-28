import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from 'src/common/exceptions/base-expections.common';

export class SessionEnvironmentKeyNotFoundException extends BaseHttpException {
  constructor(key: string) {
    super(
      {
        message: `Session environment key not found: ${key}`,
        code: 'SESSION_ENVIRONMENT_KEY_NOT_FOUND',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
      'SESSION_ENVIRONMENT_KEY_NOT_FOUND',
    );
  }
}

export class GeneratingSessionException extends BaseHttpException {
  constructor() {
    super(
      {
        message: 'Error generating session.',
        code: 'GENERATING_SESSION_ERROR',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
      'GENERATING_SESSION_ERROR',
    );
  }
}

export class InvalidSessionException extends BaseHttpException {
  constructor() {
    super(
      {
        message: 'Invalid session.',
        code: 'INVALID_SESSION',
        status: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
      'INVALID_SESSION',
    );
  }
}
