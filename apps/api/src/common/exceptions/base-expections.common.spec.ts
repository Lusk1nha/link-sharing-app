import { BaseHttpException } from './base-expections.common';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('BaseHttpException', () => {
  // Define a test exception class that extends BaseHttpException
  class TestException extends BaseHttpException {
    constructor() {
      super('Test message', HttpStatus.BAD_REQUEST, 'TEST_ERROR');
    }
  }

  it('should be defined', () => {
    expect(new TestException()).toBeDefined();
  });

  it('should extend HttpException', () => {
    const exception = new TestException();
    expect(exception).toBeInstanceOf(HttpException);
  });

  it('should implement IBaseHttpException', () => {
    const exception = new TestException();
    expect(exception.getCode).toBeDefined();
  });

  it('should have the correct status code', () => {
    const exception = new TestException();
    expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should have the correct message', () => {
    const exception = new TestException();
    expect(exception.getResponse()).toBe('Test message');
  });

  it('should have the correct error code', () => {
    const exception = new TestException();
    expect(exception.getCode()).toBe('TEST_ERROR');
  });

  describe('with object response', () => {
    class ObjectResponseException extends BaseHttpException {
      constructor() {
        super(
          { message: 'Object message', details: 'Test details' },
          HttpStatus.INTERNAL_SERVER_ERROR,
          'OBJECT_ERROR',
        );
      }
    }

    it('should handle object response', () => {
      const exception = new ObjectResponseException();
      expect(exception.getResponse()).toEqual({
        message: 'Object message',
        details: 'Test details',
      });
    });

    it('should maintain error code with object response', () => {
      const exception = new ObjectResponseException();
      expect(exception.getCode()).toBe('OBJECT_ERROR');
    });
  });

  describe('with different status codes', () => {
    it('should accept any HttpStatus', () => {
      class NotFoundException extends BaseHttpException {
        constructor() {
          super('Not found', HttpStatus.NOT_FOUND, 'NOT_FOUND');
        }
      }

      const exception = new NotFoundException();
      expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
