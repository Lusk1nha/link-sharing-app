import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from 'src/common/exceptions/base-expections.common';

export class MemoryUsageCannotBeRetrievedException extends BaseHttpException {
  constructor() {
    super(
      {
        message: 'Memory usage data is not available.',
        code: 'MEMORY_USAGE_DATA_NOT_AVAILABLE',
        status: HttpStatus.SERVICE_UNAVAILABLE,
      },
      HttpStatus.SERVICE_UNAVAILABLE,
      'MEMORY_USAGE_DATA_NOT_AVAILABLE',
    );
  }
}
