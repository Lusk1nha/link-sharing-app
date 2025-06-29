import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'src/common/entities/uuid/uuid.entity';
import { InvalidUuidException } from 'src/common/entities/uuid/uuid.errors';

export class CredentialEntity {
  constructor(
    id: UUID,
    userId: UUID,
    passwordHash: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    if (!(id instanceof UUID)) {
      throw new InvalidUuidException();
    }

    if (!(userId instanceof UUID)) {
      throw new InvalidUuidException();
    }

    this.id = id;
    this.userId = userId;
    this.passwordHash = passwordHash;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  @ApiProperty({
    description: 'Unique identifier of the credential',
    type: UUID,
    required: true,
  })
  public readonly id: UUID;

  @ApiProperty({
    description: 'Unique identifier of the user associated with the credential',
    type: UUID,
    required: true,
  })
  public readonly userId: UUID;

  @ApiProperty({
    description: 'Hashed password for the credential',
    type: String,
    required: true,
  })
  public readonly passwordHash: string;

  @ApiProperty({
    description: 'Creation date of the credential entity',
    type: Date,
  })
  public readonly createdAt?: Date;

  @ApiProperty({
    description: 'Last update date of the credential entity',
    type: Date,
  })
  public readonly updatedAt?: Date;

  static create(
    id: UUID,
    userId: UUID,
    passwordHash: string,
  ): CredentialEntity {
    return new CredentialEntity(id, userId, passwordHash);
  }
}
