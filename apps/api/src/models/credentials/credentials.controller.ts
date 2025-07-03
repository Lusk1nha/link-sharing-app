import { Body, Controller, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  AllowAuthenticated,
  GetAuthUser,
} from 'src/common/auth/auth.decorator';
import { CredentialsService } from './credentials.service';
import { UsersService } from '../users/users.service';
import { JwtStoredPayload } from 'src/common/auth/__types__/auth.types';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';
import { PasswordService } from '../password/password.service';
import { PasswordFactory } from 'src/common/entities/password/password.factory';
import { UpdateCredentialResponseDto } from './dto/update-credential-response.dto';

@Controller('credentials')
@ApiTags('Credentials')
@ApiBearerAuth()
@AllowAuthenticated()
export class CredentialsController {
  constructor(
    private readonly credentialsService: CredentialsService,
    private readonly passwordService: PasswordService,
  ) {}

  @Patch('update-credentials')
  async updateCurrentUserCredentials(
    @GetAuthUser() currentUser: JwtStoredPayload,
    @Body() body: UpdateCredentialDto,
  ) {
    const userId = UUIDFactory.from(currentUser.sub);
    const passwordVo = PasswordFactory.from(body.password);

    const hash = await this.passwordService.hashPassword(passwordVo);

    await this.credentialsService.updateCredentials(userId, hash);

    return new UpdateCredentialResponseDto();
  }
}
