import { EmailAddress } from './email-address.entity';

export class EmailAddressFactory {
  static from(value: string): EmailAddress {
    return new EmailAddress(value);
  }
}
