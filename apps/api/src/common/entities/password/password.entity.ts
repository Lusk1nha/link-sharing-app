import { ApiProperty } from '@nestjs/swagger';
import {
  InvalidPasswordException,
  WeakPasswordException,
} from './password.errors';

export class Password {
  @ApiProperty({
    description: 'The password value',
    type: String,
    example: 'StrongPassword123!',
    required: true,
  })
  private readonly _value: string;

  constructor(raw: string) {
    this.validate(raw);
    this._value = raw;
  }

  public get value() {
    return this._value;
  }

  private validate(raw: string) {
    if (typeof raw !== 'string' || !raw.trim()) {
      throw new InvalidPasswordException();
    }

    if (raw.length < 6) {
      throw new WeakPasswordException();
    }
  }
}
