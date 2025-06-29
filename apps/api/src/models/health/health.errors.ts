import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from 'src/common/exceptions/base-expections.common';

export class HealthCannotSetEnvironmentVariableException extends BaseHttpException {
  constructor(key: string) {
    super(
      {
        message: `Environment variable "${key}" cannot be set`,
        code: 'HEALTH_CANNOT_SET_ENVIRONMENT_VARIABLE',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
      'HEALTH_CANNOT_SET_ENVIRONMENT_VARIABLE',
    );
  }
}
