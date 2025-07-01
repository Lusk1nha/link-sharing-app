import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from '../exceptions/base-expections.common';

export class UnauthorizedTokenException extends BaseHttpException {
  constructor() {
    super(
      {
        message: 'The provided token is invalid or expired.',
        code: 'UNAUTHORIZED_TOKEN',
        status: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
      'UNAUTHORIZED_TOKEN',
    );
  }
}

export class ForbiddenResourceException extends BaseHttpException {
  constructor() {
    super(
      {
        message: 'You do not have permission to access this resource.',
        code: 'FORBIDDEN_RESOURCE',
        status: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
      'FORBIDDEN_RESOURCE',
    );
  }
}

export class NoTokenProvidedException extends BaseHttpException {
  constructor() {
    super(
      {
        message: 'No token provided.',
        code: 'NO_TOKEN_PROVIDED',
        status: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
      'NO_TOKEN_PROVIDED',
    );
  }
}

export class ImpossibleToGetUserFromRequestException extends BaseHttpException {
  constructor() {
    super(
      {
        message: 'Impossible to get user from request.',
        code: 'IMPOSSIBLE_TO_GET_USER_FROM_REQUEST',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
      'IMPOSSIBLE_TO_GET_USER_FROM_REQUEST',
    );
  }
}
