import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CredentialsService } from '../credentials/credentials.service';
import { PasswordService } from '../password/password.service';
import { SessionsService } from '../sessions/sessions.service';
import { EmailAddress } from 'src/common/entities/email-address/email-address.entity';
import { Password } from 'src/common/entities/password/password.entity';
import { UserEntity } from '../users/domain/user.entity';
import { LoginCredentialsInvalidException } from './auth.errors';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';

@Injectable()
export class AuthValidatorService {
  private readonly logger = new Logger(AuthValidatorService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly credentialsService: CredentialsService,
    private readonly passwordService: PasswordService,
    private readonly sessionsService: SessionsService,
  ) {}

  async validateUserCredentials(
    email: EmailAddress,
    password: Password,
  ): Promise<UserEntity> {
    const user = await this.usersService.findByEmailOrThrow(email);
    const credential = await this.credentialsService.findByUserIdOrThrow(
      user.id,
    );

    const isValid = await this.passwordService.comparePassword(
      password,
      credential.passwordHash,
    );

    if (!isValid) {
      this.logger.warn(
        `[validateUserCredentials] Invalid password for userId=${user.id.value}`,
      );
      throw new LoginCredentialsInvalidException();
    }

    return user;
  }

  async validateUserOwnership(token: string): Promise<UserEntity> {
    const claims = await this.sessionsService.validateRefreshToken(token);
    const user = await this.usersService.findByIdOrThrow(
      UUIDFactory.from(claims.sub),
    );

    this.logger.log(
      `[validateUserOwnership] Token ownership validated for userId=${user.id.value}`,
    );

    return user;
  }
}
