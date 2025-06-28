import { UUID } from 'src/common/entities/uuid/uuid.entity';
import { InvalidUuidException } from 'src/common/entities/uuid/uuid.errors';

export class CredentialEntity {
  constructor(
    public readonly id: UUID,
    public readonly userId: UUID,
    public readonly passwordHash: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {
    if (!(id instanceof UUID)) {
      throw new InvalidUuidException();
    }

    if (!(userId instanceof UUID)) {
      throw new InvalidUuidException();
    }
  }

  static create(
    id: UUID,
    userId: UUID,
    passwordHash: string,
  ): CredentialEntity {
    return new CredentialEntity(id, userId, passwordHash);
  }
}
