import { HttpStatus } from '@nestjs/common';
import { HealthCannotSetEnvironmentVariableException } from './health.errors';

describe(HealthCannotSetEnvironmentVariableException.name, () => {
  it('should be defined', () => {
    expect(HealthCannotSetEnvironmentVariableException).toBeDefined();
  });

  it('should create an instance of HealthCannotSetEnvironmentVariableException', () => {
    const exception = new HealthCannotSetEnvironmentVariableException('test');
    expect(exception).toBeInstanceOf(
      HealthCannotSetEnvironmentVariableException,
    );
  });

  it('should have the correct message', () => {
    const variableName = 'test';
    const exception = new HealthCannotSetEnvironmentVariableException('test');
    expect(exception.message).toBe(
      `Environment variable "${variableName}" cannot be set`,
    );
    expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(exception.getCode()).toBe('HEALTH_CANNOT_SET_ENVIRONMENT_VARIABLE');
  });
});
