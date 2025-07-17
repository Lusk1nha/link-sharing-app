import { PasswordService } from 'src/models/password/password.service';
import { AuthValidatorService } from '../auth.validator';
import { SessionsService } from 'src/models/sessions/sessions.service';
import { CredentialsService } from 'src/models/credentials/credentials.service';
import { UsersService } from 'src/models/users/users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker/.';
import { EmailAddressFactory } from 'src/common/entities/email-address/email-address.factory';
import { PasswordFactory } from 'src/common/entities/password/password.factory';
import { generateSingleMockUser } from 'src/models/users/__mock__/users.mock';
import { UserMapper } from 'src/models/users/domain/user.mapper';
import { generateSingleMockCredential } from 'src/models/credentials/__mock__/credentials.mock';
import { CredentialMapper } from 'src/models/credentials/domain/credential.mapper';
import { UserEntity } from 'src/models/users/domain/user.entity';
import { UserNotFoundException } from 'src/models/users/users.errors';
import { LoginCredentialsInvalidException } from '../auth.errors';
import { UserJwtPayload } from 'src/common/auth/__types__/auth.types';

describe(AuthValidatorService.name, () => {
  let authValidatorService: AuthValidatorService;
  let usersService: UsersService;
  let credentialsService: CredentialsService;
  let passwordService: PasswordService;
  let sessionsService: SessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthValidatorService,
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
            findByUserIdOrThrow: jest.fn(),
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
            validateRefreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    authValidatorService =
      module.get<AuthValidatorService>(AuthValidatorService);
    usersService = module.get<UsersService>(UsersService);
    credentialsService = module.get<CredentialsService>(CredentialsService);
    passwordService = module.get<PasswordService>(PasswordService);
    sessionsService = module.get<SessionsService>(SessionsService);
  });

  it('should be defined', () => {
    expect(authValidatorService).toBeDefined();
    expect(usersService).toBeDefined();
    expect(credentialsService).toBeDefined();
    expect(passwordService).toBeDefined();
    expect(sessionsService).toBeDefined();
  });

  describe(AuthValidatorService.prototype.validateUserCredentials.name, () => {
    it('should be defined', () => {
      expect(authValidatorService.validateUserCredentials).toBeDefined();
    });

    it('should validate user credentials successfully', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();

      const user = generateSingleMockUser({ email });
      const userVo = UserMapper.toDomain(user);

      const credential = generateSingleMockCredential({ userId: user.id });
      const credentialVo = CredentialMapper.toDomain(credential);

      const emailVo = EmailAddressFactory.from(email);
      const passwordVo = PasswordFactory.from(password);

      (usersService.findByEmailOrThrow as jest.Mock).mockResolvedValueOnce(
        userVo,
      );
      (
        credentialsService.findByUserIdOrThrow as jest.Mock
      ).mockResolvedValueOnce(credentialVo);
      (passwordService.comparePassword as jest.Mock).mockResolvedValueOnce(
        true,
      );

      const result = await authValidatorService.validateUserCredentials(
        emailVo,
        passwordVo,
      );

      expect(usersService.findByEmailOrThrow).toHaveBeenCalledWith(emailVo);
      expect(credentialsService.findByUserIdOrThrow).toHaveBeenCalledWith(
        userVo.id,
      );
      expect(passwordService.comparePassword).toHaveBeenCalledWith(
        passwordVo,
        credentialVo.passwordHash,
      );

      expect(result).toEqual(userVo);
      expect(result).toBeInstanceOf(UserEntity);
    });

    it('should throw UserNotFoundException if user does not exist', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();
      const emailVo = EmailAddressFactory.from(email);
      const passwordVo = PasswordFactory.from(password);

      (usersService.findByEmailOrThrow as jest.Mock).mockRejectedValueOnce(
        new UserNotFoundException(),
      );

      await expect(
        authValidatorService.validateUserCredentials(emailVo, passwordVo),
      ).rejects.toBeInstanceOf(UserNotFoundException);

      expect(usersService.findByEmailOrThrow).toHaveBeenCalledWith(emailVo);
    });

    it('should throw LoginCredentialsInvalidException if password is invalid', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();

      const user = generateSingleMockUser({ email });
      const userVo = UserMapper.toDomain(user);

      const credential = generateSingleMockCredential({ userId: user.id });
      const credentialVo = CredentialMapper.toDomain(credential);

      const emailVo = EmailAddressFactory.from(email);
      const passwordVo = PasswordFactory.from(password);

      (usersService.findByEmailOrThrow as jest.Mock).mockResolvedValueOnce(
        userVo,
      );
      (
        credentialsService.findByUserIdOrThrow as jest.Mock
      ).mockResolvedValueOnce(credentialVo);
      (passwordService.comparePassword as jest.Mock).mockResolvedValueOnce(
        false,
      );

      await expect(
        authValidatorService.validateUserCredentials(emailVo, passwordVo),
      ).rejects.toThrow(new LoginCredentialsInvalidException());

      expect(usersService.findByEmailOrThrow).toHaveBeenCalledWith(emailVo);
      expect(credentialsService.findByUserIdOrThrow).toHaveBeenCalledWith(
        userVo.id,
      );
    });
  });

  describe(AuthValidatorService.prototype.validateUserOwnership.name, () => {
    it('should be defined', () => {
      expect(authValidatorService.validateUserOwnership).toBeDefined();
    });

    it('should validate user ownership successfully', async () => {
      const token = faker.string.alphanumeric();

      const userVo = UserMapper.toDomain(generateSingleMockUser());

      const claims = {
        aud: 'api',
        iss: 'auth',
        sub: userVo.id.value,
        email: userVo.email.value,
        iat: Math.floor(Date.now() / 1000),
      } as UserJwtPayload;

      (sessionsService.validateRefreshToken as jest.Mock).mockResolvedValueOnce(
        claims,
      );

      (usersService.findByIdOrThrow as jest.Mock).mockResolvedValueOnce(userVo);

      const result = await authValidatorService.validateUserOwnership(token);

      expect(sessionsService.validateRefreshToken).toHaveBeenCalledWith(token);
      expect(usersService.findByIdOrThrow).toHaveBeenCalledWith(userVo.id);
      expect(result).toEqual(userVo);
      expect(result).toBeInstanceOf(UserEntity);
    });

    it('should throw error to validate user ownership if token is invalid', async () => {
      const token = faker.string.alphanumeric();

      (sessionsService.validateRefreshToken as jest.Mock).mockRejectedValueOnce(
        new Error('Invalid token'),
      );

      await expect(
        authValidatorService.validateUserOwnership(token),
      ).rejects.toThrow();

      expect(sessionsService.validateRefreshToken).toHaveBeenCalledWith(token);
      expect(usersService.findByIdOrThrow).not.toHaveBeenCalled();
    });

    it('should throw UserNotFoundException if user does not exist', async () => {
      const token = faker.string.alphanumeric();

      const claims = {
        aud: 'api',
        iss: 'auth',
        sub: faker.string.uuid(),
        email: faker.internet.email(),
        iat: Math.floor(Date.now() / 1000),
      } as UserJwtPayload;

      (sessionsService.validateRefreshToken as jest.Mock).mockResolvedValueOnce(
        claims,
      );

      (usersService.findByIdOrThrow as jest.Mock).mockRejectedValueOnce(
        new UserNotFoundException(),
      );

      await expect(
        authValidatorService.validateUserOwnership(token),
      ).rejects.toBeInstanceOf(UserNotFoundException);

      expect(sessionsService.validateRefreshToken).toHaveBeenCalledWith(token);
    });
  });
});
