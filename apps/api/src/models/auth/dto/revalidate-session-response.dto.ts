import { ApiProperty } from '@nestjs/swagger';
import { TokenEntity } from 'src/models/token/domain/token.entity';

export class RevalidateSessionResponseDto {
  @ApiProperty({
    description: 'New JWT access token for the user',
  })
  accessToken: string;

  constructor(accessToken: TokenEntity) {
    this.accessToken = accessToken.token;
  }
}
