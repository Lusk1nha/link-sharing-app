import { ApiProperty } from '@nestjs/swagger';
import { ProfileEntity } from '../domain/profile.entity';

export class GetProfileResponseDto {
  constructor(profile: ProfileEntity) {
    this.profile = profile;
  }

  @ApiProperty({
    description: 'Profile details of the user',
    type: ProfileEntity,
    required: true,
  })
  profile: ProfileEntity;
}
