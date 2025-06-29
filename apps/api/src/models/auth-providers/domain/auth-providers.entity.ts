import { ApiProperty } from '@nestjs/swagger';
import { AuthSignInType } from '@prisma/client';
import { UUID } from 'src/common/entities/uuid/uuid.entity';
import { InvalidUuidException } from 'src/common/entities/uuid/uuid.errors';

export class AuthProviderEntity {
  constructor(
    id: UUID,
    userId: UUID,
    providerType: AuthSignInType,
    providerId?: string,
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
    this.providerType = providerType;
    this.providerId = providerId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  @ApiProperty({
    description: 'Unique identifier of the auth provider',
    type: UUID,
  })
  public readonly id: UUID;

  @ApiProperty({
    description:
      'Unique identifier of the user associated with the auth provider',
    type: UUID,
  })
  public readonly userId: UUID;

  @ApiProperty({
    description: 'Type of the authentication provider',
    enum: AuthSignInType,
  })
  public readonly providerType: AuthSignInType;

  @ApiProperty({
    description: 'Unique identifier for the provider account',
    type: String,
  })
  public readonly providerId?: string;

  @ApiProperty({
    description: 'Creation date of the auth provider entity',
    type: Date,
  })
  public readonly createdAt?: Date;

  @ApiProperty({
    description: 'Last update date of the auth provider entity',
    type: Date,
  })
  public readonly updatedAt?: Date;

  static create(
    id: UUID,
    userId: UUID,
    providerType: AuthSignInType,
    providerId?: string,
  ): AuthProviderEntity {
    return new AuthProviderEntity(id, userId, providerType, providerId);
  }
}
