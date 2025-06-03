import { EmailAddress } from "src/common/entities/email/email.entity";

export interface CreateCredentialDto {
  email: EmailAddress;
  password: string;
}
