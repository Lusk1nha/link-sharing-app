import { Body, Controller, Patch } from '@nestjs/common';
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

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('update')
  @ApiOperation({ summary: 'Update user information' })
  @ApiOkResponse({ type: UpdateUserResponseDto })
  async updateUser(@Body() body: UpdateUserDto) {
    const userId = UUIDFactory.from('');

    const user = await this.usersService.updateUser(userId, body);

    return new UpdateUserResponseDto(user);
  }
}
