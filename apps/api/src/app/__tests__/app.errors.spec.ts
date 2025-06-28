import { BaseHttpException } from 'src/common/exceptions/base-expections.common';
import { AppErrorToSetEnvironmentVariableException } from '../app.errors';
import { HttpStatus } from '@nestjs/common';

describe(AppErrorToSetEnvironmentVariableException.name, () => {
  const key = 'TEST_ENV_VAR';

  it('should be defined', () => {
    expect(AppErrorToSetEnvironmentVariableException).toBeDefined();
  });

  it('should be an instance of BaseHttpException', () => {
    const error = new AppErrorToSetEnvironmentVariableException(key);
    expect(error).toBeInstanceOf(BaseHttpException);
  });

  it('should have the correct properties', () => {
    const error = new AppErrorToSetEnvironmentVariableException(key);
    expect(error.getCode()).toBe('APP_ERROR_TO_SET_VARIABLE');
    expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(error.getMessage()).toBe(`Environment variable ${key} is not set`);
  });
});
