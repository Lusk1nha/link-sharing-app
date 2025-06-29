import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from 'src/common/exceptions/base-expections.common';

export class AppErrorToSetEnvironmentVariableException extends BaseHttpException {
  constructor(key: string) {
    super(
      {
        message: `Environment variable ${key} is not set`,
        code: 'APP_ERROR_TO_SET_VARIABLE',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
      'APP_ERROR_TO_SET_VARIABLE',
    );
  }
}
