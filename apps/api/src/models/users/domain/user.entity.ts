import { ApiProperty } from '@nestjs/swagger';

import { EmailAddress } from 'src/common/entities/email-address/email-address.entity';
import { InvalidEmailAddressException } from 'src/common/entities/email-address/email-address.errors';
import { UUID } from 'src/common/entities/uuid/uuid.entity';
import { InvalidUuidException } from 'src/common/entities/uuid/uuid.errors';

export interface UserPatch {
  email?: EmailAddress;
  isActive?: boolean;
}

export class UserEntity {
  constructor(
    id: UUID,
    email: EmailAddress,
    isActive: boolean = true,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    if (!(id instanceof UUID)) {
      throw new InvalidUuidException('Invalid user ID format.');
    }

    if (!(email instanceof EmailAddress)) {
      throw new InvalidEmailAddressException();
    }

    this.id = id;
    this.email = email;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  @ApiProperty({
    description: 'Unique identifier of the user',
    type: UUID,
    required: true,
  })
  public readonly id: UUID;

  @ApiProperty({
    description: 'Email address of the user',
    type: EmailAddress,
    required: true,
  })
  public readonly email: EmailAddress;

  @ApiProperty({
    description: 'Indicates if the user is active',
    type: Boolean,
    required: false,
    default: true,
  })
  public readonly isActive: boolean;

  @ApiProperty({
    description: 'Creation date of the user entity',
    type: Date,
    required: false,
    example: '2023-10-01T12:00:00Z',
  })
  public readonly createdAt?: Date;

  @ApiProperty({
    description: 'Last update date of the user entity',
    type: Date,
    required: false,
    example: '2023-10-01T12:00:00Z',
  })
  public readonly updatedAt?: Date;

  static create(id: UUID, email: EmailAddress): UserEntity {
    return new UserEntity(id, email);
  }

  public static patch(original: UserEntity, patch: UserPatch): UserEntity {
    return new UserEntity(
      original.id,
      patch.email ?? original.email,
      original.isActive,
      original.createdAt,
      new Date(),
    );
  }
}
