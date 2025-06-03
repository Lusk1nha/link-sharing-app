import { ApiProperty } from "@nestjs/swagger";
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
  @ApiProperty({
    type: UUID,
    description: "Unique identifier for the credential",
  })
  readonly id: UUID;

  @ApiProperty({
    type: UUID,
    description:
      "Unique identifier for the user associated with the credential",
  })
  readonly userId: UUID;

  @ApiProperty({
    type: EmailAddress,
    description: "Email address associated with the credential",
  })
  readonly email: EmailAddress;

  @ApiProperty({
    type: String,
    description: "Hashed password for the credential",
  })
  readonly passwordHash: string;

  @ApiProperty({
    type: Date,
    description: "Timestamp when the credential was created",
  })
  readonly createdAt: Date;

  @ApiProperty({
    type: Date,
    description: "Timestamp when the credential was last updated",
  })
  readonly updatedAt: Date;

  constructor(data: CredentialDto) {
    this.id = UUIDFactory.from(data.id);
    this.userId = UUIDFactory.from(data.userId);
    this.email = EmailFactory.from(data.email);
    this.passwordHash = data.passwordHash;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
