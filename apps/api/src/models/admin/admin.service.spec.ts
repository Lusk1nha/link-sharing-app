import { PrismaService } from 'src/common/database/database.service';
import { AdminService } from './admin.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminMapper } from './domain/admin.mapper';
import { generateSingleMockAdmin } from './__mock__/admin.mock';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';
import { AdminEntity } from './domain/admin.entity';
import { AdminNotFoundException } from './admin.errors';

describe(AdminService.name, () => {
  let service: AdminService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: PrismaService,
          useValue: {
            admin: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('Find Admin by User ID', () => {
    it(`should be defined ${AdminService.prototype.findByUserId.name}`, () => {
      expect(service.findByUserId).toBeDefined();
    });

    it('should return an admin if found by user ID', async () => {
      const raw = generateSingleMockAdmin();

      jest.spyOn(prismaService.admin, 'findUnique').mockResolvedValueOnce(raw);

      const admin = await service.findByUserId(UUIDFactory.from(raw.userId));

      if (!admin) {
        throw new Error('[Test] Admin not found');
      }

      expect(admin).toBeDefined();
      expect(admin).toEqual(AdminMapper.toDomain(raw));
      expect(admin).toBeInstanceOf(AdminEntity);
      expect(prismaService.admin.findUnique).toHaveBeenCalledWith({
        where: { userId: raw.userId },
      });
    });

    it('should return null if no admin found by user ID', async () => {
      jest.spyOn(prismaService.admin, 'findUnique').mockResolvedValueOnce(null);

      const userId = UUIDFactory.create();
      const admin = await service.findByUserId(userId);

      expect(admin).toBeNull();
    });
  });

  describe('Find Admin by User ID or Throw Error', () => {
    it(`should be defined ${AdminService.prototype.findByUserIdOrThrow.name}`, () => {
      expect(service.findByUserIdOrThrow).toBeDefined();
    });

    it('should return an admin if found by user ID', async () => {
      const raw = generateSingleMockAdmin();

      jest.spyOn(prismaService.admin, 'findUnique').mockResolvedValueOnce(raw);

      const admin = await service.findByUserIdOrThrow(
        UUIDFactory.from(raw.userId),
      );

      expect(admin).toBeInstanceOf(AdminEntity);
      expect(admin).toEqual(AdminMapper.toDomain(raw));
      expect(prismaService.admin.findUnique).toHaveBeenCalledWith({
        where: { userId: raw.userId },
      });
    });

    it('should throw an error if no admin found by user ID', async () => {
      jest.spyOn(prismaService.admin, 'findUnique').mockResolvedValueOnce(null);

      const userId = UUIDFactory.create();

      await expect(service.findByUserIdOrThrow(userId)).rejects.toThrow(
        new AdminNotFoundException(),
      );
    });
  });

  describe('Create new Admin', () => {
    it(`should be defined ${AdminService.prototype.createAdmin.name}`, () => {
      expect(service.createAdmin).toBeDefined();
    });

    it('should create a new admin for a user', async () => {
      const raw = generateSingleMockAdmin();

      const admin = AdminEntity.createNew(
        UUIDFactory.from(raw.id),
        UUIDFactory.from(raw.userId),
      );

      jest.spyOn(prismaService.admin, 'create').mockResolvedValueOnce(raw);
      const createdAdmin = await service.createAdmin(admin);

      expect(createdAdmin).toBeInstanceOf(AdminEntity);
      expect(createdAdmin).toEqual(AdminMapper.toDomain(raw));
      expect(prismaService.admin.create).toHaveBeenCalledWith({
        data: {
          id: raw.id,
          userId: raw.userId,
        },
      });
    });
  });
});
