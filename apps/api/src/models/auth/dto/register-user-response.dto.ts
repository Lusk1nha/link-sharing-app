import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/models/users/domain/user.entity';

export class RegisterUserResponseDto {
  constructor(user: UserEntity) {
    this.userId = user.id.value;
  }

  @ApiProperty({
    description: 'Unique identifier of the registered user',
    type: String,
  })
  userId: string;

  @ApiProperty({
    example: 'User registered successfully',
    description: 'Message indicating successful registration',
  })
  message: 'User registered successfully';
}
