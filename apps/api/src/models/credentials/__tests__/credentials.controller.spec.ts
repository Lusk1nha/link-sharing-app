import { Test, TestingModule } from '@nestjs/testing';
import { CredentialsController } from '../credentials.controller';
import { CredentialsService } from '../credentials.service';
import { UsersModule } from 'src/models/users/users.module';
import { PasswordModule } from 'src/models/password/password.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/common/database/database.service';
import { RolesModule } from 'src/models/roles/roles.module';
import { SessionsModule } from 'src/models/sessions/sessions.module';
import { CacheModule } from '@nestjs/cache-manager';
import { generateSingleMockUser } from 'src/models/users/__mock__/users.mock';
import { JwtStoredPayload } from 'src/common/auth/__types__/auth.types';
import { Role } from 'src/common/roles/roles.common';
import { UpdateCredentialDto } from '../dto/update-credential.dto';
import { ValidationPipe } from '@nestjs/common';
import { generateSingleMockCredential } from '../__mock__/credentials.mock';
import { CredentialMapper } from '../domain/credential.mapper';
import { UserMapper } from 'src/models/users/domain/user.mapper';
import { UpdateCredentialResponseDto } from '../dto/update-credential-response.dto';
import { PasswordService } from 'src/models/password/password.service';
import { faker } from '@faker-js/faker/.';

describe(CredentialsController.name, () => {
  let controller: CredentialsController;
  let credentialsService: CredentialsService;
  let passwordService: PasswordService;

  beforeEach(() => {
    jest.clearAllMocks(); // zera contadores entre testes
    jest.resetAllMocks(); // remove implementações anteriores
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        RolesModule,
        SessionsModule,
        CacheModule.register({
          isGlobal: true,
        }),
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        PasswordModule,
      ],
      controllers: [CredentialsController],
      providers: [
        {
          provide: CredentialsService,
          useValue: {
            updateCredentials: jest.fn(),
          },
        },
        {
          provide: PasswordService,
          useValue: {
            hashPassword: jest.fn(),
          },
        },
        PrismaService,
      ],
    }).compile();

    controller = module.get<CredentialsController>(CredentialsController);
    credentialsService = module.get<CredentialsService>(CredentialsService);
    passwordService = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(credentialsService).toBeDefined();
  });

  describe('updateCurrentUserCredentials', () => {
    it(`should be defined`, () => {
      expect(controller.updateCurrentUserCredentials).toBeDefined();
    });

    it(`should validate the request body`, async () => {
      let target: ValidationPipe = new ValidationPipe({
        transform: true,
        whitelist: true,
      });

      const body: UpdateCredentialDto = {
        password: faker.internet.password({
          pattern: /[A-Za-z0-9!@#$%^&*()_+]/,
        }),
      };

      await expect(
        target.transform(body, {
          type: 'body',
          metatype: UpdateCredentialDto,
        }),
      ).resolves.toEqual(body);
    });

    it(`should validate the request body with invalid data`, async () => {
      let target: ValidationPipe = new ValidationPipe({
        transform: true,
        whitelist: true,
      });

      const body: UpdateCredentialDto = {
        password: '', // Invalid password
      };

      await expect(
        target.transform(body, {
          type: 'body',
          metatype: UpdateCredentialDto,
        }),
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it(`should update user credentials`, async () => {
      const mockUser = generateSingleMockUser();
      const mockUserEntity = UserMapper.toDomain(mockUser);

      const body: UpdateCredentialDto = {
        password: 'new-password',
      };

      const mockCredential = generateSingleMockCredential({
        userId: mockUser.id,
        passwordHash: 'new-password-hash',
      });
      const mockCredentialEntity = CredentialMapper.toDomain(mockCredential);

      const jwtUserPayload: JwtStoredPayload = {
        sub: mockUser.id,
        email: mockUser.email,
        roles: [Role.User],
        aud: 'api',
        iat: Date.now(),
        exp: Date.now() + 3600,
        iss: 'test-issuer',
      };

      jest
        .spyOn(passwordService, 'hashPassword')
        .mockResolvedValue('new-password-hash');

      jest
        .spyOn(credentialsService, 'updateCredentials')
        .mockResolvedValue(mockCredentialEntity);

      const response = await controller.updateCurrentUserCredentials(
        jwtUserPayload,
        body,
      );

      expect(credentialsService.updateCredentials).toHaveBeenCalledTimes(1);
      expect(response).toBeInstanceOf(UpdateCredentialResponseDto);
    });
  });
});
