import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { TokenEntity } from 'src/models/token/domain/token.entity';
import { UserEntity } from 'src/models/users/domain/user.entity';
import { UserMapper } from 'src/models/users/domain/user.mapper';

export class LoginUserResponseDto {
  constructor(user: UserEntity, accessToken: TokenEntity) {
    this.user = UserMapper.toModel(user);
    this.accessToken = accessToken.token;
  }

  @ApiProperty({
    description: 'User details',
  })
  user: User;

  @ApiProperty({
    description: 'JWT access token for the user',
    type: String,
  })
  accessToken: string;
}
