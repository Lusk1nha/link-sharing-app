import { EmailAddress } from "./email.entity";

export class EmailFactory {
  static from(value: string): EmailAddress {
    return new EmailAddress(value);
  }
}
