import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../domain/user.entity';

export class GetUserResponseDto {
  constructor(user: UserEntity) {
    this.user = user;
  }

  @ApiProperty({
    type: UserEntity,
    description: 'User details',
  })
  user: UserEntity;
}
