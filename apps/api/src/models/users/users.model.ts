import { User } from "@prisma/client";
import { UUID } from "src/common/entities/uuid/uuid.entity";
import { UUIDFactory } from "src/common/entities/uuid/uuid.factory";

export class UserModel {
  readonly id: UUID;
  readonly active: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(data: User) {
    this.id = UUIDFactory.from(data.id);
    this.active = data.active;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
