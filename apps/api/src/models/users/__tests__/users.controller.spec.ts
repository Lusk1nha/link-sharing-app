import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { PrismaService } from 'src/common/database/database.service';
import { RolesModule } from 'src/models/roles/roles.module';
import { SessionsModule } from 'src/models/sessions/sessions.module';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { generateSingleMockUser } from '../__mock__/users.mock';
import { JwtStoredPayload } from 'src/common/auth/__types__/auth.types';
import { Role } from 'src/common/roles/roles.common';
import { UserMapper } from '../domain/user.mapper';
import { GetUserResponseDto } from '../dto/get-user-response.dto';
import { ForbiddenResourceException } from 'src/common/auth/auth-common.errors';
import { DeleteUserResponseDto } from '../dto/delete-user-response.dto';
import { fa, faker } from '@faker-js/faker/.';
import { UpdateUserResponseDto } from '../dto/update-user-response.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ValidationPipe } from '@nestjs/common';

describe(UsersController.name, () => {
  let controller: UsersController;
  let usersService: UsersService;
  let prismaService: PrismaService;

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
      ],
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findByIdOrThrow: jest.fn(),
            updateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(usersService).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('getCurrentUser route', () => {
    it(`should be defined ${UsersController.prototype.getCurrentUser.name}`, () => {
      expect(controller.getCurrentUser).toBeDefined();
    });

    it(`should call ${UsersService.prototype.findByIdOrThrow.name} when route is called`, async () => {
      const mockUser = generateSingleMockUser();
      const jwtUserPayload: JwtStoredPayload = {
        sub: mockUser.id,
        email: mockUser.email,
        roles: [Role.User],
        aud: 'api',
        iat: Date.now(),
        exp: Date.now() + 3600,
        iss: 'test-issuer',
      };

      const mockUserEntity = UserMapper.toDomain(mockUser);

      jest
        .spyOn(usersService, 'findByIdOrThrow')
        .mockResolvedValue(mockUserEntity);

      const response = await controller.getCurrentUser(jwtUserPayload);

      expect(usersService.findByIdOrThrow).toHaveBeenCalledWith(
        mockUserEntity.id,
      );
      expect(usersService.findByIdOrThrow).toHaveBeenCalledTimes(1);
      expect(response.user).toEqual(mockUserEntity);
      expect(response).toBeInstanceOf(GetUserResponseDto);
    });
  });

  describe('getUserById route', () => {
    it(`should be defined ${UsersController.prototype.getUserById.name}`, () => {
      expect(controller.getUserById).toBeDefined();
    });

    it(`should call different user if the request user is Admin`, async () => {
      const requestUser = generateSingleMockUser();
      const userToGet = generateSingleMockUser();

      const jwtUserPayload: JwtStoredPayload = {
        sub: requestUser.id,
        email: requestUser.email,
        roles: [Role.Admin],
        aud: 'api',
        iat: Date.now(),
        exp: Date.now() + 3600,
        iss: 'test-issuer',
      };

      const mockUserEntity = UserMapper.toDomain(userToGet);

      jest
        .spyOn(usersService, 'findByIdOrThrow')
        .mockResolvedValue(mockUserEntity);

      const response = await controller.getUserById(
        jwtUserPayload,
        mockUserEntity.id,
      );

      expect(usersService.findByIdOrThrow).toHaveBeenCalledWith(
        mockUserEntity.id,
      );
      expect(usersService.findByIdOrThrow).toHaveBeenCalledTimes(1);
      expect(response.user).toEqual(mockUserEntity);
      expect(response).toBeInstanceOf(GetUserResponseDto);
    });

    it(`should throw ForbiddenResourceException if the request user is not Admin`, async () => {
      const requestUser = generateSingleMockUser();
      const userToGet = generateSingleMockUser();

      const jwtUserPayload: JwtStoredPayload = {
        sub: requestUser.id,
        email: requestUser.email,
        roles: [Role.User],
        aud: 'api',
        iat: Date.now(),
        exp: Date.now() + 3600,
        iss: 'test-issuer',
      };

      const mockUserEntity = UserMapper.toDomain(userToGet);

      jest
        .spyOn(usersService, 'findByIdOrThrow')
        .mockResolvedValue(mockUserEntity);

      await expect(
        controller.getUserById(jwtUserPayload, mockUserEntity.id),
      ).rejects.toThrow(new ForbiddenResourceException());
      expect(usersService.findByIdOrThrow).toHaveBeenCalledWith(
        mockUserEntity.id,
      );
    });

    it(`should return user data when user call himself`, async () => {
      const requestUser = generateSingleMockUser();
      const jwtUserPayload: JwtStoredPayload = {
        sub: requestUser.id,
        email: requestUser.email,
        roles: [],
        aud: 'api',
        iat: Date.now(),
        exp: Date.now() + 3600,
        iss: 'test-issuer',
      };

      const mockRequestUserEntity = UserMapper.toDomain(requestUser);

      jest
        .spyOn(usersService, 'findByIdOrThrow')
        .mockResolvedValue(mockRequestUserEntity);

      const response = await controller.getUserById(
        jwtUserPayload,
        mockRequestUserEntity.id,
      );

      expect(usersService.findByIdOrThrow).toHaveBeenCalledWith(
        mockRequestUserEntity.id,
      );
      expect(usersService.findByIdOrThrow).toHaveBeenCalledTimes(1);
      expect(response.user).toEqual(mockRequestUserEntity);
      expect(response).toBeInstanceOf(GetUserResponseDto);
    });
  });

  describe('updateCurrentUser route', () => {
    it(`should be defined ${UsersController.prototype.updateCurrentUser.name}`, () => {
      expect(controller.updateCurrentUser).toBeDefined();
    });

    it(`should validate request dto`, async () => {
      const mockUser = generateSingleMockUser();

      const jwtUserPayload: JwtStoredPayload = {
        sub: mockUser.id,
        email: mockUser.email,
        roles: [Role.User],
        aud: 'api',
        iat: Date.now(),
        exp: Date.now() + 3600,
        iss: 'test-issuer',
      };

      let target: ValidationPipe = new ValidationPipe({
        transform: true,
        whitelist: true,
      });

      const body: UpdateUserDto = {
        email: 'invalid-email', // Invalid email format
      };

      await expect(
        target.transform(body, {
          type: 'body',
          metatype: UpdateUserDto,
        }),
      ).rejects.toThrowErrorMatchingSnapshot();
    });

    it(`should call updateCurrentUser route with valid data`, async () => {
      const mockUser = generateSingleMockUser();

      const mockWithNewEmail = generateSingleMockUser({
        id: mockUser.id,
        email: faker.internet.email(),
      });

      const jwtUserPayload: JwtStoredPayload = {
        sub: mockUser.id,
        email: mockUser.email,
        roles: [Role.User],
        aud: 'api',
        iat: Date.now(),
        exp: Date.now() + 3600,
        iss: 'test-issuer',
      };

      const mockUserUpdatedEntity = UserMapper.toDomain(mockWithNewEmail);

      jest
        .spyOn(usersService, 'updateUser')
        .mockResolvedValue(mockUserUpdatedEntity);

      const response = await controller.updateCurrentUser(jwtUserPayload, {
        email: mockWithNewEmail.email,
      });

      expect(usersService.updateUser).toHaveBeenCalledWith(
        mockUserUpdatedEntity.id,
        {
          email: mockWithNewEmail.email,
        },
      );
      expect(usersService.updateUser).toHaveBeenCalledTimes(1);
      expect(response.user).toEqual(mockUserUpdatedEntity);
      expect(response).toBeInstanceOf(UpdateUserResponseDto);
    });
  });

  describe('deleteCurrentUser route', () => {
    it(`should be defined ${UsersController.prototype.deleteCurrentUser.name}`, () => {
      expect(controller.deleteCurrentUser).toBeDefined();
    });

    it(`should call ${UsersService.prototype.deleteUser.name} when route is called`, async () => {
      const mockUser = generateSingleMockUser();
      const jwtUserPayload: JwtStoredPayload = {
        sub: mockUser.id,
        email: mockUser.email,
        roles: [Role.User],
        aud: 'api',
        iat: Date.now(),
        exp: Date.now() + 3600,
        iss: 'test-issuer',
      };

      const mockUserEntity = UserMapper.toDomain(mockUser);

      jest.spyOn(usersService, 'deleteUser').mockResolvedValue();

      const response = await controller.deleteCurrentUser(jwtUserPayload);

      expect(usersService.deleteUser).toHaveBeenCalledWith(mockUserEntity.id);
      expect(usersService.deleteUser).toHaveBeenCalledTimes(1);
      expect(response).toBeDefined();
      expect(response).toBeInstanceOf(DeleteUserResponseDto);
    });
  });
});
