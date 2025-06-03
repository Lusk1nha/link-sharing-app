import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { UUID } from "src/common/entities/uuid/uuid.entity";
import { UUIDFactory } from "src/common/entities/uuid/uuid.factory";

export type UserDto = {
  id: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class UserModel {
  @ApiProperty({
    type: UUID,
    description: "Unique identifier for the user",
  })
  readonly id: UUID;

  @ApiProperty({
    type: Boolean,
    description: "Indicates if the user is active",
  })
  readonly active: boolean;

  @ApiProperty({
    type: Date,
    description: "Timestamp when the user was created",
  })
  readonly createdAt: Date;

  @ApiProperty({
    type: Date,
    description: "Timestamp when the user was last updated",
  })
  readonly updatedAt: Date;

  constructor(data: UserDto) {
    this.id = UUIDFactory.from(data.id);
    this.active = data.active;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
