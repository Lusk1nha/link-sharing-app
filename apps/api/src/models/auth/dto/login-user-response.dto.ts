import { ApiProperty } from '@nestjs/swagger';
import { TokenEntity } from 'src/models/token/domain/token.entity';
import { UserEntity } from 'src/models/users/domain/user.entity';

export class LoginUserResponseDto {
  constructor(user: UserEntity, accessToken: TokenEntity) {
    this.user = user;
    this.accessToken = accessToken.token;
  }

  @ApiProperty({
    description: 'User details',
    type: UserEntity,
  })
  user: UserEntity;

  @ApiProperty({
    description: 'JWT access token for the user',
    type: String,
  })
  accessToken: string;
}
