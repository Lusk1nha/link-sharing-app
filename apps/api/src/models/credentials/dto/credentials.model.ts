import { EmailAddress } from "src/common/entities/email/email.entity";
import { EmailFactory } from "src/common/entities/email/email.factory";
import { UUID } from "src/common/entities/uuid/uuid.entity";
import { UUIDFactory } from "src/common/entities/uuid/uuid.factory";

export type CredentialDto = {
  id: string;
  userId: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

export class CredentialModel {
  private readonly _id: UUID;
  private readonly _userId: UUID;
  private readonly _email: EmailAddress;
  private readonly _passwordHash: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  constructor(data: CredentialDto) {
    this._id = UUIDFactory.from(data.id);
    this._userId = UUIDFactory.from(data.userId);
    this._email = EmailFactory.from(data.email);
    this._passwordHash = data.passwordHash;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
  }

  get id(): UUID {
    return this._id;
  }

  get userId(): UUID {
    return this._userId;
  }

  get email(): EmailAddress {
    return this._email;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
