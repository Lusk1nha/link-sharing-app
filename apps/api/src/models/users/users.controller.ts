import { Body, Controller, Get, Patch } from '@nestjs/common';
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
import { AuthenticatedUserPayload } from 'src/common/auth/__types__/auth.types';
import { GetUserResponseDto } from './dto/get-user-response.dto';

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
    @GetAuthUser() currentUser: AuthenticatedUserPayload,
  ): Promise<GetUserResponseDto> {
    const userId = UUIDFactory.from(currentUser.sub);
    const user = await this.usersService.findByIdOrThrow(userId);

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
  async updateUser(
    @GetAuthUser() currentUser: AuthenticatedUserPayload,
    @Body() body: UpdateUserDto,
  ) {
    const userId = UUIDFactory.from(currentUser.sub);
    const user = await this.usersService.updateUser(userId, body);
    return new UpdateUserResponseDto(user);
  }
}
