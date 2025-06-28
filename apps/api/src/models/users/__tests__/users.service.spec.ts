import { PrismaService } from 'src/common/database/database.service';
import { UsersService } from '../users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';

import { faker } from '@faker-js/faker';
import { EmailAddressFactory } from 'src/common/entities/email-address/email-address.factory';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';
import { generateSingleMockUser } from '../__mock__/users.mock';

import { UserEntity } from '../domain/user.entity';
import { UserMapper } from '../domain/user.mapper';
import {
  UserAlreadyExistsException,
  UserNotFoundException,
} from '../users.errors';

describe(UsersService.name, () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              update: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('Find user by email', () => {
    it(`should be defined ${UsersService.prototype.findByEmail.name}`, () => {
      expect(service.findByEmail).toBeDefined();
    });

    it('should return a user if found by email', async () => {
      const email = faker.internet.email();
      const mockId = faker.string.uuid();

      const userFound = generateSingleMockUser({
        id: mockId,
        email,
      });

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(userFound);

      const result = await service.findByEmail(EmailAddressFactory.from(email));
      expect(result).toEqual(UserMapper.toDomain(userFound));
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('should return null if no user found', async () => {
      const email = faker.internet.email();
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const result = await service.findByEmail(EmailAddressFactory.from(email));
      expect(result).toBeNull();
    });
  });

  describe('Find user by ID', () => {
    it(`should be defined ${UsersService.prototype.findById.name}`, () => {
      expect(service.findById).toBeDefined();
    });

    it('should return a user if found by ID', async () => {
      const raw = generateSingleMockUser();

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(raw);
      const result = await service.findById(UUIDFactory.from(raw.id));

      expect(result).toEqual(UserMapper.toDomain(raw));
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: raw.id },
      });
      expect(result).toBeInstanceOf(UserEntity);
    });
  });

  describe('Find user by ID or throw error', () => {
    it(`should be defined ${UsersService.prototype.findByIdOrThrow.name}`, () => {
      expect(service.findByIdOrThrow).toBeDefined();
    });

    it('should return a user if found by ID', async () => {
      const raw = generateSingleMockUser();

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(raw);
      const result = await service.findByIdOrThrow(UUIDFactory.from(raw.id));

      expect(result).toEqual(UserMapper.toDomain(raw));
      expect(result).toBeInstanceOf(UserEntity);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: raw.id },
      });
    });

    it('should throw UserNotFoundException if no user found', async () => {
      const mockId = faker.string.uuid();
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(
        service.findByIdOrThrow(UUIDFactory.from(mockId)),
      ).rejects.toThrow(new UserNotFoundException());
    });
  });

  describe('Create new user', () => {
    it(`should be defined ${UsersService.prototype.createUser.name}`, () => {
      expect(service.createUser).toBeDefined();
    });

    it('should create a new user', async () => {
      const mockId = faker.string.uuid();
      const email = faker.internet.email();

      const userEntity = UserEntity.create(
        UUIDFactory.from(mockId),
        EmailAddressFactory.from(email),
      );

      const userCreated: User = generateSingleMockUser({
        id: mockId,
        email,
      });

      jest.spyOn(prismaService.user, 'create').mockResolvedValue(userCreated);
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const result = await service.createUser(userEntity);

      expect(result).toEqual(UserMapper.toDomain(userCreated));
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          id: mockId,
          email,
        },
      });
    });

    it('should throw an error if user already exists', async () => {
      const mockId = faker.string.uuid();
      const email = faker.internet.email();

      const userEntity = UserEntity.create(
        UUIDFactory.from(mockId),
        EmailAddressFactory.from(email),
      );

      jest
        .spyOn(prismaService.user, 'create')
        .mockRejectedValue(new UserAlreadyExistsException());

      await expect(service.createUser(userEntity)).rejects.toThrow(
        new UserAlreadyExistsException(),
      );
    });
  });
});
