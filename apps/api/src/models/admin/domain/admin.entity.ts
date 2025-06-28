import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'src/common/entities/uuid/uuid.entity';
import { InvalidUuidException } from 'src/common/entities/uuid/uuid.errors';

export class AdminEntity {
  constructor(id: UUID, userId: UUID, createdAt?: Date, updatedAt?: Date) {
    if (!(id instanceof UUID)) {
      throw new InvalidUuidException('Invalid admin ID format.');
    }

    if (!(userId instanceof UUID)) {
      throw new InvalidUuidException('Invalid user ID format.');
    }

    this.id = id;
    this.userId = userId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  @ApiProperty({
    description: 'Unique identifier of the admin',
    type: UUID,
  })
  public readonly id: UUID;

  @ApiProperty({
    description: 'Unique identifier of the user associated with the admin',
    type: UUID,
  })
  public readonly userId: UUID;

  @ApiProperty({
    description: 'Timestamp when the admin was created',
    type: Date,
    required: false,
  })
  public readonly createdAt?: Date;

  @ApiProperty({
    description: 'Timestamp when the admin was last updated',
    type: Date,
    required: false,
  })
  public readonly updatedAt?: Date;

  static createNew(id: UUID, userId: UUID): AdminEntity {
    return new AdminEntity(id, userId);
  }
}
