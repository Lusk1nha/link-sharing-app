import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'src/common/entities/uuid/uuid.entity';
import { Role } from 'src/common/roles/roles.common';
import { UserEntity } from 'src/models/users/domain/user.entity';

export class GetUserRolesByIdResponseDto {
  constructor(user: UserEntity, roles: Role[]) {
    this.userId = user.id;
    this.roles = roles;
  }

  @ApiProperty({
    description: 'Unique identifier of the user',
  })
  userId: UUID;

  @ApiProperty({
    enum: Role,
    description: 'List of roles assigned to the user',
    isArray: true,
    example: [Role.User, Role.Admin],
  })
  roles: Role[];
}
