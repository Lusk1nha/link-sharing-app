import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtStoredPayload } from 'src/common/auth/__types__/auth.types';
import {
  AllowAuthenticated,
  GetAuthUser,
} from 'src/common/auth/auth.decorator';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';
import { ProfileService } from './profile.service';
import { GetProfileResponseDto } from './dto/get-profile-response.dto';
import { UUIDParam } from 'src/common/entities/uuid/uuid.decorator';
import { UUID } from 'src/common/entities/uuid/uuid.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('profile')
@ApiTags('Profile')
@ApiBearerAuth()
@AllowAuthenticated()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Get current user profile',
    description:
      'Retrieve the profile details of the currently authenticated user',
  })
  async getCurrentProfile(
    @GetAuthUser() currentUser: JwtStoredPayload,
  ): Promise<GetProfileResponseDto | null> {
    const userId = UUIDFactory.from(currentUser.sub);
    const profile = await this.profileService.findUserById(userId);

    return profile ? new GetProfileResponseDto(profile) : null;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user profile by ID',
    description: 'Retrieve profile details by user ID',
  })
  async getProfileById(
    @UUIDParam('id') userId: UUID,
  ): Promise<GetProfileResponseDto | null> {
    const profile = await this.profileService.findUserById(userId);

    if (profile) {
      return new GetProfileResponseDto(profile);
    }

    return null;
  }

  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadAvatar(
    @GetAuthUser() currentUser: JwtStoredPayload,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/(jpeg|png)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<GetProfileResponseDto> {
    const userId = UUIDFactory.from(currentUser.sub);
    const profile = await this.profileService.updateAvatar(userId, file);

    return new GetProfileResponseDto(profile);
  }
}
