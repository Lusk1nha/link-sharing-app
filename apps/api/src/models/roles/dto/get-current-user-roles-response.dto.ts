import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/common/roles/roles.common';

export class GetCurrentUserRolesResponseDto {
  constructor(roles: Role[]) {
    this.roles = roles;
  }

  @ApiProperty({
    enum: Role,
    description: 'The role of the user',
  })
  roles: Role[];
}
