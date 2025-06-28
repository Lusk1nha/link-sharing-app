import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'src/common/entities/uuid/uuid.entity';
import { UserEntity } from 'src/models/users/domain/user.entity';

export class RegisterUserResponseDto {
  constructor(user: UserEntity) {
    this.userId = user.id;
  }

  @ApiProperty({
    description: 'Unique identifier of the registered user',
    type: UUID,
  })
  userId: UUID;

  @ApiProperty({
    example: 'User registered successfully',
    description: 'Message indicating successful registration',
  })
  message: 'User registered successfully';
}
