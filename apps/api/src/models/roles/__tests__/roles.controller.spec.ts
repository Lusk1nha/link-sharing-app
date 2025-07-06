import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from '../roles.controller';
import { RolesModule } from '../roles.module';
import { SessionsModule } from 'src/models/sessions/sessions.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { PasswordModule } from 'src/models/password/password.module';
import { RolesService } from '../roles.service';
import { UsersService } from 'src/models/users/users.service';
import { Role } from 'src/common/roles/roles.common';
import { generateSingleMockUser } from 'src/models/users/__mock__/users.mock';
import { UserMapper } from 'src/models/users/domain/user.mapper';
import { JwtStoredPayload } from 'src/common/auth/__types__/auth.types';

import { ForbiddenResourceException } from 'src/common/auth/auth-common.errors';

describe(RolesController.name, () => {
  let controller: RolesController;
  let rolesService: RolesService;
  let usersService: UsersService;

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
          ignoreEnvFile: true,
        }),
        PasswordModule,
      ],
      controllers: [RolesController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findByIdOrThrow: jest.fn(),
          },
        },
        {
          provide: RolesService,
          useValue: {
            getAllRoles: jest.fn(),
            getRoleById: jest.fn(),
            createRole: jest.fn(),
            updateRole: jest.fn(),
            deleteRole: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    rolesService = module.get<RolesService>(RolesService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(rolesService).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('getCurrentUserRoles', () => {
    it('should be defined', () => {
      expect(controller.getCurrentUserRoles).toBeDefined();
    });

    it('should return user roles', async () => {
      const mockUser = generateSingleMockUser();

      const mockRoles = [Role.User];

      const jwtUserPayload: JwtStoredPayload = {
        sub: mockUser.id,
        email: mockUser.email,
        roles: [Role.User],
        aud: 'api',
        iat: Date.now(),
        exp: Date.now() + 3600,
        iss: 'test-issuer',
      };

      jest.spyOn(rolesService, 'getRolesByUserId').mockResolvedValue(mockRoles);

      const result = await controller.getCurrentUserRoles(jwtUserPayload);

      expect(result).toBeDefined();
      expect(result.roles).toStrictEqual(mockRoles);
      expect(rolesService.getRolesByUserId).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserRolesById', () => {
    it('should be defined', () => {
      expect(controller.getUserRolesById).toBeDefined();
    });

    it('should return user roles by ID', async () => {
      const mockUser = generateSingleMockUser();

      const mockRoles = [Role.User];

      const jwtUserPayload: JwtStoredPayload = {
        sub: mockUser.id,
        email: mockUser.email,
        roles: [Role.User, Role.Admin],
        aud: 'api',
        iat: Date.now(),
        exp: Date.now() + 3600,
        iss: 'test-issuer',
      };

      const mockResponseUser = UserMapper.toDomain(generateSingleMockUser());

      jest
        .spyOn(usersService, 'findByIdOrThrow')
        .mockResolvedValue(mockResponseUser);

      jest.spyOn(rolesService, 'getRolesByUserId').mockResolvedValue(mockRoles);

      const result = await controller.getUserRolesById(
        mockResponseUser.id,
        jwtUserPayload,
      );

      expect(result).toBeDefined();
      expect(result.userId.value).toStrictEqual(mockResponseUser.id.value);
      expect(result.roles).toStrictEqual(mockRoles);
      expect(usersService.findByIdOrThrow).toHaveBeenCalledTimes(1);
      expect(rolesService.getRolesByUserId).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if user does not have permission', () => {
      const mockUser = generateSingleMockUser();

      const mockRoles = [Role.Admin];

      const jwtUserPayload: JwtStoredPayload = {
        sub: mockUser.id,
        email: mockUser.email,
        roles: [Role.User],
        aud: 'api',
        iat: Date.now(),
        exp: Date.now() + 3600,
        iss: 'test-issuer',
      };

      const mockResponseUser = UserMapper.toDomain(generateSingleMockUser());

      jest
        .spyOn(usersService, 'findByIdOrThrow')
        .mockResolvedValue(mockResponseUser);

      jest.spyOn(rolesService, 'getRolesByUserId').mockResolvedValue(mockRoles);

      const result = controller.getUserRolesById(
        mockResponseUser.id,
        jwtUserPayload,
      );

      expect(result).rejects.toThrow(new ForbiddenResourceException());
    });
  });
});
