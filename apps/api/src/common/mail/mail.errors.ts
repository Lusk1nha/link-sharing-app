import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from '../exceptions/base-expections.common';

export class SendMailException extends BaseHttpException {
  constructor(message: string) {
    super(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Failed to send email: ${message}`,
        error: 'MAIL_SEND_ERROR',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
      'MAIL_SEND_ERROR',
    );
  }
}

export class TemplateNotFoundException extends BaseHttpException {
  constructor(template: string) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: `Template ${template} not found`,
        error: 'TEMPLATE_NOT_FOUND',
      },
      HttpStatus.NOT_FOUND,
      'TEMPLATE_NOT_FOUND',
    );
  }
}
