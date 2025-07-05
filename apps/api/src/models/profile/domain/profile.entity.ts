import { UUID } from 'src/common/entities/uuid/uuid.entity';

export class ProfileEntity {
  constructor(
    id: UUID,
    userId: UUID,

    firstName: string,
    lastName: string,
    imageUrl?: string,

    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.imageUrl = imageUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public readonly id: UUID;
  public readonly userId: UUID;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly imageUrl?: string;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  static create(
    id: UUID,
    userId: UUID,
    firstName: string,
    lastName: string,
    imageUrl?: string,
  ): ProfileEntity {
    return new ProfileEntity(id, userId, firstName, lastName, imageUrl);
  }

  static patch(
    original: ProfileEntity,
    patch: Partial<ProfileEntity>,
  ): ProfileEntity {
    return new ProfileEntity(
      original.id,
      original.userId,
      patch.firstName ?? original.firstName,
      patch.lastName ?? original.lastName,
      patch.imageUrl ?? original.imageUrl,
      original.createdAt,
      original.updatedAt,
    );
  }
}
