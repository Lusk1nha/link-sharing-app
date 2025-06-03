import { UUID } from "src/common/entities/uuid/uuid.entity";
import { UUIDFactory } from "src/common/entities/uuid/uuid.factory";

export type UserDto = {
  id: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class UserModel {
  private readonly _id: UUID;
  private readonly _active: boolean;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  constructor(data: UserDto) {
    this._id = UUIDFactory.from(data.id);
    this._active = data.active;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
  }

  get id(): UUID {
    return this._id;
  }

  get active(): boolean {
    return this._active;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
