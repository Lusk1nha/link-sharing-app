import { ApiProperty } from "@nestjs/swagger";
import { AuthProvider } from "@prisma/client";

import { UUID } from "src/common/entities/uuid/uuid.entity";
import { UUIDFactory } from "src/common/entities/uuid/uuid.factory";

export type AuthProviderType = AuthProvider["type"];

export interface AuthProviderDto {
  id: string;
  userId: string;
  type: AuthProviderType;
  createdAt: Date;
}

export class AuthProviderModel {
  @ApiProperty({
    type: UUID,
    description: "Unique identifier for the auth provider",
  })
  readonly id: UUID;

  @ApiProperty({
    type: UUID,
    description:
      "Unique identifier for the user associated with the auth provider",
  })
  readonly userId: UUID;

  @ApiProperty({
    enum: ["CREDENTIALS", "GITHUB", "GOOGLE"],
    description: "Type of the authentication provider",
  })
  readonly type: AuthProviderType;

  @ApiProperty({
    type: Date,
    description: "Timestamp when the auth provider was created",
  })
  readonly createdAt: Date;

  constructor(data: AuthProviderDto) {
    this.id = UUIDFactory.from(data.id);
    this.userId = UUIDFactory.from(data.userId);
    this.type = data.type;
    this.createdAt = data.createdAt;
  }
}
