import { HttpException, HttpStatus } from '@nestjs/common';

interface IBaseHttpException {
  getCode(): string;
}

export abstract class BaseHttpException
  extends HttpException
  implements IBaseHttpException
{
  constructor(
    response: string | Record<string, any>,
    status: HttpStatus,
    private readonly code: string,
  ) {
    super(response, status);
  }

  getCode(): string {
    return this.code;
  }

  getMessage(): string {
    if (typeof this.getResponse() === 'string') {
      return this.getResponse() as string;
    }

    if (typeof this.getResponse() === 'object' && this.getResponse() !== null) {
      return (this.getResponse() as Record<string, any>).message || '';
    }

    return '';
  }
}
