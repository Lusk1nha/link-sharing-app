import { Body, Controller, Delete, Get, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';

import { UpdateUserResponseDto } from './dto/update-user-response.dto';
import {
  AllowAuthenticated,
  GetAuthUser,
} from 'src/common/auth/auth.decorator';
import { JwtStoredPayload } from 'src/common/auth/__types__/auth.types';
import { GetUserResponseDto } from './dto/get-user-response.dto';
import { UUIDParam } from 'src/common/entities/uuid/uuid.decorator';
import { UUID } from 'src/common/entities/uuid/uuid.entity';
import { checkRowLevelPermission } from 'src/common/auth/auth.common';

import { DeleteUserResponseDto } from './dto/delete-user-response.dto';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@AllowAuthenticated()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Get current user',
    description: 'Retrieve the details of the currently authenticated user',
  })
  @ApiOkResponse({
    type: GetUserResponseDto,
    description: 'Successfully retrieved user details',
  })
  async getCurrentUser(
    @GetAuthUser() currentUser: JwtStoredPayload,
  ): Promise<GetUserResponseDto> {
    const userId = UUIDFactory.from(currentUser.sub);
    const user = await this.usersService.findByIdOrThrow(userId);

    return new GetUserResponseDto(user);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve user details by their unique identifier',
  })
  @ApiOkResponse({
    type: GetUserResponseDto,
    description: 'Successfully retrieved user details',
  })
  async getUserById(
    @GetAuthUser() currentUser: JwtStoredPayload,
    @UUIDParam('id') userId: UUID,
  ): Promise<GetUserResponseDto> {
    const user = await this.usersService.findByIdOrThrow(userId);
    checkRowLevelPermission(currentUser, user.id);

    return new GetUserResponseDto(user);
  }

  @Patch('me')
  @ApiOperation({
    summary: 'Update current user',
    description: 'Update the details of the currently authenticated user',
  })
  @ApiOkResponse({
    type: UpdateUserResponseDto,
    description: 'Successfully updated user details',
  })
  async updateCurrentUser(
    @GetAuthUser() currentUser: JwtStoredPayload,
    @Body() body: UpdateUserDto,
  ) {
    const userId = UUIDFactory.from(currentUser.sub);
    const user = await this.usersService.updateUser(userId, body);
    return new UpdateUserResponseDto(user);
  }

  @Delete('me')
  @ApiOperation({
    summary: 'Delete current user',
    description: 'Delete the currently authenticated user account',
  })
  @ApiOkResponse({
    description: 'Successfully deleted user account',
  })
  async deleteCurrentUser(
    @GetAuthUser() currentUser: JwtStoredPayload,
  ): Promise<DeleteUserResponseDto> {
    const userId = UUIDFactory.from(currentUser.sub);
    await this.usersService.deleteUser(userId);

    return new DeleteUserResponseDto();
  }
}
