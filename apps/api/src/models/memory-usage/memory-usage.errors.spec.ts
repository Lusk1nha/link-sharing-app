import { BaseHttpException } from 'src/common/exceptions/base-expections.common';
import { MemoryUsageCannotBeRetrievedException } from './memory-usage.errors';
import { HttpStatus } from '@nestjs/common';

describe(MemoryUsageCannotBeRetrievedException.name, () => {
  it('should be defined', () => {
    expect(MemoryUsageCannotBeRetrievedException).toBeDefined();
  });

  it('should create an instance of BaseHttpException', () => {
    const exception = new MemoryUsageCannotBeRetrievedException();
    expect(exception).toBeInstanceOf(BaseHttpException);
  });

  it('should have the correct message', () => {
    const exception = new MemoryUsageCannotBeRetrievedException();
    expect(exception.message).toBe('Memory usage data is not available.');
    expect(exception.getStatus()).toBe(HttpStatus.SERVICE_UNAVAILABLE);
    expect(exception.getCode()).toBe('MEMORY_USAGE_DATA_NOT_AVAILABLE');
  });
});
