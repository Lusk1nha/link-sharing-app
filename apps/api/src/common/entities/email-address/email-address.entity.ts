import * as Joi from 'joi';

import {
  EmptyEmailAddressException,
  InvalidEmailAddressException,
} from './email-address.errors';
import { ApiProperty } from '@nestjs/swagger';

export class EmailAddress {
  @ApiProperty({
    description: 'The email address value',
    type: String,
    example: 'example@test.com',
    required: true,
  })
  private readonly _value: string;

  constructor(value: string) {
    this.validate(value);
    this._value = value;
  }

  public get value() {
    return this._value;
  }

  private validate(value: string): void {
    if (!value) {
      throw new EmptyEmailAddressException();
    }

    const validator = Joi.string().email().required();

    if (validator.validate(value).error || typeof value !== 'string') {
      throw new InvalidEmailAddressException();
    }
  }
}
