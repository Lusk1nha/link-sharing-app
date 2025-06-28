import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PasswordService } from '../password/password.service';
import { UsersService } from '../users/users.service';
import { CredentialsService } from '../credentials/credentials.service';
import { PrismaService } from 'src/common/database/database.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserEntity } from '../users/domain/user.entity';
import { CredentialEntity } from '../credentials/domain/credential.entity';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';
import { EmailAddressFactory } from 'src/common/entities/email-address/email-address.factory';
import { faker } from '@faker-js/faker/.';
import { SessionsService } from '../sessions/sessions.service';
import { LoginUserDto } from './dto/login-user.dto';
import { UserMapper } from '../users/domain/user.mapper';
import { generateSingleMockUser } from '../users/__mock__/users.mock';
import { CredentialMapper } from '../credentials/domain/credential.mapper';
import { generateSingleMockCredential } from '../credentials/__mock__/credentials.mock';
import { generateSingleMockToken } from '../token/__mock__/token.mock';
import { SessionTokens } from './__types__/auth.types';
import { TokenMapper } from '../token/domain/token.mapper';
import { PasswordFactory } from 'src/common/entities/password/password.factory';
import {
  LoginCredentialsInvalidException,
  NoRefreshTokenProvidedException,
} from './auth.errors';
import {
  UserAlreadyExistsException,
  UserNotFoundException,
} from '../users/users.errors';
import { CredentialNotFoundException } from '../credentials/credentials.errors';
import { RevalidateSessionDto } from './dto/revalidate-session.dto';
import { UserJwtPayload } from 'src/common/auth/__types__/auth.types';
import { InvalidSessionException } from '../sessions/sessions.errors';
import { LogoutUserDto } from './dto/logout-user.dto';

describe(AuthService.name, () => {
  let authService: AuthService;
  let usersService: UsersService;
  let credentialsService: CredentialsService;
  let passwordService: PasswordService;
  let sessionsService: SessionsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn().mockImplementation(async (cb) => cb({})),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            findByEmailOrThrow: jest.fn(),
            findByIdOrThrow: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: CredentialsService,
          useValue: {
            findByUserId: jest.fn(),
            findByUserIdOrThrow: jest.fn(),
            createCredential: jest.fn(),
          },
        },
        {
          provide: PasswordService,
          useValue: {
            hashPassword: jest.fn(),
            comparePassword: jest.fn(),
          },
        },
        {
          provide: SessionsService,
          useValue: {
            createSession: jest.fn(),
            validateRefreshToken: jest.fn(),
            revalidateByRefreshToken: jest.fn(),
            revokeByRefreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    credentialsService = module.get<CredentialsService>(CredentialsService);
    passwordService = module.get<PasswordService>(PasswordService);
    sessionsService = module.get<SessionsService>(SessionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(usersService).toBeDefined();
    expect(credentialsService).toBeDefined();
    expect(passwordService).toBeDefined();
    expect(sessionsService).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe(AuthService.prototype.register.name, () => {
    it('should be defined', () => {
      expect(authService.register).toBeDefined();
    });

    it('should register a user and create credential inside transaction', async () => {
      const dto: RegisterUserDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const mockUserId = UUIDFactory.create();
      const mockCredId = UUIDFactory.create();

      const mockUserEntity = UserEntity.create(
        mockUserId,
        EmailAddressFactory.from(dto.email),
      );

      const mockCredentialEntity = CredentialEntity.create(
        mockCredId,
        mockUserId,
        'hashed-password',
      );

      jest
        .spyOn(passwordService, 'hashPassword')
        .mockResolvedValueOnce('hashed-password');

      jest
        .spyOn(usersService, 'createUser')
        .mockImplementationOnce(async () => mockUserEntity);

      jest
        .spyOn(credentialsService, 'createCredential')
        .mockImplementationOnce(async () => mockCredentialEntity);

      const result = await authService.register(dto);

      expect(passwordService.hashPassword).toHaveBeenCalled();
      expect(usersService.createUser).toHaveBeenCalledWith(
        expect.any(UserEntity),
        expect.any(Object),
      );
      expect(credentialsService.createCredential).toHaveBeenCalledWith(
        expect.any(CredentialEntity),
        expect.any(Object),
      );
      expect(prisma.$transaction).toHaveBeenCalled();

      expect(result).toEqual(mockUserEntity);
    });

    it('should throw an error if user already exists', async () => {
      const dto: RegisterUserDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      jest
        .spyOn(usersService, 'createUser')
        .mockRejectedValueOnce(new UserAlreadyExistsException());

      await expect(authService.register(dto)).rejects.toThrow(
        new UserAlreadyExistsException(),
      );
    });
  });

  describe(AuthService.prototype.login.name, () => {
    it('should be defined', () => {
      expect(authService.login).toBeDefined();
    });

    it('should login a user and return session tokens', async () => {
      const dto: LoginUserDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const user = UserMapper.toDomain(
        generateSingleMockUser({
          email: dto.email,
        }),
      );

      const credential = CredentialMapper.toDomain(
        generateSingleMockCredential({
          userId: user.id.value,
        }),
      );

      const sessionTokens: SessionTokens = {
        accessToken: TokenMapper.toDomain(generateSingleMockToken()),
        refreshToken: TokenMapper.toDomain(generateSingleMockToken()),
      };

      jest
        .spyOn(usersService, 'findByEmailOrThrow')
        .mockResolvedValueOnce(user);

      jest
        .spyOn(credentialsService, 'findByUserIdOrThrow')
        .mockResolvedValueOnce(credential);

      jest
        .spyOn(passwordService, 'comparePassword')
        .mockResolvedValueOnce(true);

      jest
        .spyOn(sessionsService, 'createSession')
        .mockResolvedValueOnce(sessionTokens);

      const result = await authService.login(dto);

      expect(usersService.findByEmailOrThrow).toHaveBeenCalledWith(
        EmailAddressFactory.from(dto.email),
      );

      expect(credentialsService.findByUserIdOrThrow).toHaveBeenCalledWith(
        user.id,
      );
      expect(passwordService.comparePassword).toHaveBeenCalledWith(
        PasswordFactory.from(dto.password),
        credential.passwordHash,
      );

      expect(sessionsService.createSession).toHaveBeenCalledWith(user);
      expect(result).toEqual({
        user,
        accessToken: sessionTokens.accessToken,
        refreshToken: sessionTokens.refreshToken,
      });
    });

    it('should throw an error if user credentials are invalid', async () => {
      const dto: LoginUserDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const user = UserMapper.toDomain(
        generateSingleMockUser({
          email: dto.email,
        }),
      );

      const credential = CredentialMapper.toDomain(
        generateSingleMockCredential({
          userId: user.id.value,
        }),
      );

      jest
        .spyOn(usersService, 'findByEmailOrThrow')
        .mockResolvedValueOnce(user);

      jest
        .spyOn(credentialsService, 'findByUserIdOrThrow')
        .mockResolvedValueOnce(credential);

      jest
        .spyOn(passwordService, 'comparePassword')
        .mockResolvedValueOnce(false);

      await expect(authService.login(dto)).rejects.toThrow(
        new LoginCredentialsInvalidException(),
      );
    });

    it('should throw an error if user does not exist', async () => {
      const dto: LoginUserDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      jest
        .spyOn(usersService, 'findByEmailOrThrow')
        .mockRejectedValueOnce(new UserNotFoundException());

      await expect(authService.login(dto)).rejects.toThrow(
        new UserNotFoundException(),
      );
    });

    it('should throw an error if credential does not exist', async () => {
      const dto: LoginUserDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const user = UserMapper.toDomain(
        generateSingleMockUser({
          email: dto.email,
        }),
      );

      jest
        .spyOn(usersService, 'findByEmailOrThrow')
        .mockResolvedValueOnce(user);

      jest
        .spyOn(credentialsService, 'findByUserIdOrThrow')
        .mockRejectedValueOnce(new CredentialNotFoundException());

      await expect(authService.login(dto)).rejects.toThrow(
        new CredentialNotFoundException(),
      );
    });
  });

  describe(AuthService.prototype.revalidate.name, () => {
    it('should be defined', () => {
      expect(authService.revalidate).toBeDefined();
    });

    it('should revalidate session and return new tokens', async () => {
      const dto: RevalidateSessionDto = {
        refreshToken: 'valid-refresh-token',
      };

      const user = UserMapper.toDomain(generateSingleMockUser());
      const userJwtPayload = {
        sub: user.id.value,
        email: user.email.value,
        aud: 'api',
        iss: 'auth',
        iat: Math.floor(Date.now() / 1000),
      } as UserJwtPayload;

      const sessionTokens: SessionTokens = {
        accessToken: TokenMapper.toDomain(generateSingleMockToken()),
        refreshToken: TokenMapper.toDomain(generateSingleMockToken()),
      };

      jest
        .spyOn(sessionsService, 'validateRefreshToken')
        .mockResolvedValueOnce(userJwtPayload);

      jest.spyOn(usersService, 'findByIdOrThrow').mockResolvedValueOnce(user);

      jest
        .spyOn(sessionsService, 'revalidateByRefreshToken')
        .mockResolvedValueOnce(sessionTokens);

      const result = await authService.revalidate(dto);

      expect(sessionsService.validateRefreshToken).toHaveBeenCalledWith(
        dto.refreshToken,
      );
      expect(usersService.findByIdOrThrow).toHaveBeenCalledWith(
        UUIDFactory.from(userJwtPayload.sub),
      );
      expect(sessionsService.revalidateByRefreshToken).toHaveBeenCalledWith(
        user,
        dto.refreshToken,
      );
      expect(result).toEqual({
        accessToken: sessionTokens.accessToken,
        refreshToken: sessionTokens.refreshToken,
      });
    });

    it('should throw an error if no refresh token is provided', async () => {
      const dto: RevalidateSessionDto = {
        refreshToken: '',
      };

      await expect(authService.revalidate(dto)).rejects.toThrow(
        new NoRefreshTokenProvidedException(),
      );
    });

    it('should throw an error if refresh token is invalid', async () => {
      const dto: RevalidateSessionDto = {
        refreshToken: 'invalid-refresh-token',
      };

      jest
        .spyOn(sessionsService, 'validateRefreshToken')
        .mockRejectedValueOnce(new InvalidSessionException());

      await expect(authService.revalidate(dto)).rejects.toThrow(
        new InvalidSessionException(),
      );
    });
  });

  describe(AuthService.prototype.logout.name, () => {
    it('should be defined', () => {
      expect(authService.logout).toBeDefined();
    });

    it('should logout user and revoke session by refresh token', async () => {
      const dto: LogoutUserDto = {
        refreshToken: 'valid-refresh-token',
      };

      const user = UserMapper.toDomain(generateSingleMockUser());
      const userJwtPayload = {
        sub: user.id.value,
        email: user.email.value,
        aud: 'api',
        iss: 'auth',
        iat: Math.floor(Date.now() / 1000),
      } as UserJwtPayload;

      jest
        .spyOn(sessionsService, 'validateRefreshToken')
        .mockResolvedValueOnce(userJwtPayload);

      jest.spyOn(usersService, 'findByIdOrThrow').mockResolvedValueOnce(user);

      jest
        .spyOn(sessionsService, 'revokeByRefreshToken')
        .mockResolvedValueOnce();

      await authService.logout(dto);

      expect(sessionsService.validateRefreshToken).toHaveBeenCalledWith(
        dto.refreshToken,
      );

      expect(usersService.findByIdOrThrow).toHaveBeenCalledWith(
        UUIDFactory.from(userJwtPayload.sub),
      );

      expect(sessionsService.revokeByRefreshToken).toHaveBeenCalledWith(
        user,
        dto.refreshToken,
      );
    });

    it('should throw an error if no refresh token is provided', async () => {
      const dto: LogoutUserDto = {
        refreshToken: '',
      };

      await expect(authService.logout(dto)).rejects.toThrow(
        new NoRefreshTokenProvidedException(),
      );
    });

    it('should throw an error if refresh token is invalid', async () => {
      const dto: LogoutUserDto = {
        refreshToken: 'invalid-refresh-token',
      };

      jest
        .spyOn(sessionsService, 'validateRefreshToken')
        .mockRejectedValueOnce(new InvalidSessionException());

      await expect(authService.logout(dto)).rejects.toThrow(
        new InvalidSessionException(),
      );
    });
  });
});
