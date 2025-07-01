import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from '../roles.service';

import { UsersService } from 'src/models/users/users.service';
import { AdminService } from 'src/models/admin/admin.service';
import { PrismaService } from 'src/common/database/database.service';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';
import { generateSingleMockUser } from 'src/models/users/__mock__/users.mock';
import { UserMapper } from 'src/models/users/domain/user.mapper';
import { Role } from 'src/common/roles/roles.common';
import { AdminMapper } from 'src/models/admin/domain/admin.mapper';
import { generateSingleMockAdmin } from 'src/models/admin/__mock__/admin.mock';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { RedisCacheService } from 'src/models/redis-cache/redis-cache.service';

describe(RolesService.name, () => {
  let rolesService: RolesService;
  let usersService: UsersService;
  let adminService: AdminService;
  let redisService: RedisCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, JwtModule],
      providers: [
        RolesService,
        AdminService,
        UsersService,
        PrismaService,
        {
          provide: RedisCacheService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
        ConfigService,
      ],
    }).compile();

    rolesService = module.get<RolesService>(RolesService);
    usersService = module.get<UsersService>(UsersService);
    adminService = module.get<AdminService>(AdminService);
    redisService = module.get<RedisCacheService>(RedisCacheService);
  });

  it('should be defined', () => {
    expect(rolesService).toBeDefined();
    expect(usersService).toBeDefined();
    expect(adminService).toBeDefined();
  });

  it('should return User role for a user with no admin role', async () => {
    const user = UserMapper.toDomain(generateSingleMockUser());

    jest.spyOn(usersService, 'findById').mockResolvedValue(user);
    jest.spyOn(adminService, 'findByUserId').mockResolvedValue(null);

    const roles = await rolesService.getRolesByUserId(user.id);

    expect(roles).toEqual([Role.User]);
    expect(usersService.findById).toHaveBeenCalledWith(user.id);
    expect(adminService.findByUserId).toHaveBeenCalledWith(user.id);
  });

  it('should return Admin role for a user with admin role', async () => {
    const user = UserMapper.toDomain(generateSingleMockUser());
    const admin = AdminMapper.toDomain(
      generateSingleMockAdmin({
        userId: user.id.value,
      }),
    );

    jest.spyOn(usersService, 'findById').mockResolvedValue(user);
    jest.spyOn(adminService, 'findByUserId').mockResolvedValue(admin);

    const roles = await rolesService.getRolesByUserId(user.id);

    expect(roles).toEqual([Role.User, Role.Admin]);
    expect(usersService.findById).toHaveBeenCalledWith(user.id);
    expect(adminService.findByUserId).toHaveBeenCalledWith(user.id);
  });

  it('should return empty array for a user with no roles', async () => {
    const userId = UUIDFactory.create();

    jest.spyOn(usersService, 'findById').mockResolvedValue(null);
    jest.spyOn(adminService, 'findByUserId').mockResolvedValue(null);

    const roles = await rolesService.getRolesByUserId(userId);

    expect(roles).toEqual([]);
    expect(usersService.findById).toHaveBeenCalledWith(userId);
    expect(adminService.findByUserId).toHaveBeenCalledWith(userId);
  });
});
