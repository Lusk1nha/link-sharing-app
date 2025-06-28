import { Password } from './password.entity';

export class PasswordFactory {
  public static from(value: string): Password {
    return new Password(value);
  }
}
