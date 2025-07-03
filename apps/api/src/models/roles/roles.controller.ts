import { Controller, Get } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AllowAuthenticated,
  GetAuthUser,
} from 'src/common/auth/auth.decorator';
import { JwtStoredPayload } from 'src/common/auth/__types__/auth.types';
import { GetCurrentUserRolesResponseDto } from './dto/get-current-user-roles-response.dto';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';
import { UUIDParam } from 'src/common/entities/uuid/uuid.decorator';
import { UUID } from 'src/common/entities/uuid/uuid.entity';
import { UsersService } from '../users/users.service';
import { checkRowLevelPermission } from 'src/common/auth/auth.common';
import { GetUserRolesByIdResponseDto } from './dto/get-user-roles-by-id-response.dto';

@Controller('roles')
@ApiTags('Roles')
@ApiBearerAuth()
@AllowAuthenticated()
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
  ) {}

  @Get('me')
  @ApiOperation({
    summary: 'Get current user roles',
    description: 'Get the roles of the current authenticated user',
  })
  async getCurrentUserRoles(
    @GetAuthUser() user: JwtStoredPayload,
  ): Promise<GetCurrentUserRolesResponseDto> {
    const userId = UUIDFactory.from(user.sub);
    const roles = await this.rolesService.getRolesByUserId(userId);

    return new GetCurrentUserRolesResponseDto(roles);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user roles by ID',
    description: 'Get the roles of a user by their ID',
  })
  async getUserRoles(
    @UUIDParam('id') userId: UUID,
    @GetAuthUser() currentUser: JwtStoredPayload,
  ): Promise<GetUserRolesByIdResponseDto> {
    const user = await this.usersService.findByIdOrThrow(userId);
    checkRowLevelPermission(currentUser, user.id);

    const roles = await this.rolesService.getRolesByUserId(userId);
    return new GetUserRolesByIdResponseDto(user, roles);
  }
}
