import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../domain/user.entity';

export class UpdateUserResponseDto {
  constructor(user: UserEntity) {
    this.user = user;
  }

  @ApiProperty({
    description: 'The updated user entity',
    type: UserEntity,
  })
  user: UserEntity;

  @ApiProperty({
    description: 'A message indicating the update was successful',
    example: 'User updated successfully',
  })
  message: string = 'User updated successfully';
}
