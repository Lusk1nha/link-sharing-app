import { Inject, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CredentialsService } from '../credentials/credentials.service';
import { PasswordService } from '../password/password.service';
import { RegisterUserDto } from './dto/register-user.dto';

import { UserEntity } from '../users/domain/user.entity';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';
import { EmailAddressFactory } from 'src/common/entities/email-address/email-address.factory';
import { PasswordFactory } from 'src/common/entities/password/password.factory';
import { CredentialEntity } from '../credentials/domain/credential.entity';
import { PrismaService } from 'src/common/database/database.service';
import { LoginUserDto } from './dto/login-user.dto';

import { NoRefreshTokenProvidedException } from './auth.errors';
import { SessionsService } from '../sessions/sessions.service';
import { RevalidateSessionDto } from './dto/revalidate-session.dto';
import { SessionTokens } from './__types__/auth.types';
import { LogoutUserDto } from './dto/logout-user.dto';
import { AuthProviderService } from '../auth-providers/auth-providers.service';
import { AuthProviderEntity } from '../auth-providers/domain/auth-providers.entity';
import { AuthSignInType } from '@prisma/client';
import { RABBITMQ_MANAGER } from 'src/common/rabbitmq/domain/rabbitmq.injects';
import { RabbitMQService } from 'src/common/rabbitmq/rabbitmq.service';
import { UserMapper } from '../users/domain/user.mapper';
import { AuthValidatorService } from './auth.validator';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly credentialsService: CredentialsService,
    private readonly authProviderService: AuthProviderService,
    private readonly passwordService: PasswordService,
    private readonly sessionsService: SessionsService,
    private readonly authValidatorService: AuthValidatorService,

    @Inject(RABBITMQ_MANAGER)
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async register(dto: RegisterUserDto) {
    const userId = UUIDFactory.create();
    const emailVo = EmailAddressFactory.from(dto.email);

    const passwordVo = PasswordFactory.from(dto.password);
    const passwordHash = await this.passwordService.hashPassword(passwordVo);

    const userEntity = UserEntity.create(userId, emailVo);
    const credEntity = CredentialEntity.create(
      UUIDFactory.create(),
      userId,
      passwordHash,
    );
    const authProviderEntity = AuthProviderEntity.create(
      UUIDFactory.create(),
      userId,
      AuthSignInType.CREDENTIALS,
    );

    const createdUser = await this.prisma.$transaction(async (tx) => {
      const user = await this.usersService.createUser(userEntity, tx);
      await this.credentialsService.createCredential(credEntity, tx);
      await this.authProviderService.createAuthProvider(authProviderEntity, tx);

      return user;
    });

    this.emitUserRegisteredEvent(createdUser);

    this.logger.log(
      `[register] User registered with email=${dto.email} and userId=${userId.value}`,
    );

    return createdUser;
  }

  async login(
    dto: LoginUserDto,
  ): Promise<SessionTokens & { user: UserEntity }> {
    const emailVo = EmailAddressFactory.from(dto.email);
    const passwordVo = PasswordFactory.from(dto.password);

    const user = await this.authValidatorService.validateUserCredentials(
      emailVo,
      passwordVo,
    );

    const { accessToken, refreshToken } =
      await this.sessionsService.createSession(user);

    this.logger.log(
      `[login] User logged in with email=${emailVo.value} and userId=${user.id.value}`,
    );

    this.emitUserLoginEvent(user);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async logout(dto: LogoutUserDto): Promise<void> {
    const { refreshToken } = dto;

    if (!refreshToken) {
      throw new NoRefreshTokenProvidedException();
    }

    const user =
      await this.authValidatorService.validateUserOwnership(refreshToken);

    await this.sessionsService.revokeByRefreshToken(user, refreshToken);
  }

  async revalidate(dto: RevalidateSessionDto): Promise<SessionTokens> {
    const { refreshToken } = dto;

    if (!refreshToken) {
      throw new NoRefreshTokenProvidedException();
    }

    const user =
      await this.authValidatorService.validateUserOwnership(refreshToken);

    const { accessToken, refreshToken: newRefreshToken } =
      await this.sessionsService.revalidateByRefreshToken(user, refreshToken);

    this.logger.log(
      `[revalidateSession] Session revalidated for userId=${user.id.value}`,
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  private emitUserRegisteredEvent(user: UserEntity): void {
    const model = UserMapper.toModel(user);
    this.rabbitMQService.publish('auth.user.registered', model);
  }

  private emitUserLoginEvent(user: UserEntity): void {
    const model = UserMapper.toModel(user);
    this.rabbitMQService.publish('auth.user.login', model);
  }
}
