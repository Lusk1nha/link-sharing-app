import { PrismaService } from 'src/common/database/database.service';
import { CredentialsService } from './credentials.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';
import { faker } from '@faker-js/faker';
import { generateSingleMockCredential } from './__mock__/credentials.mock';

import { CredentialEntity } from './domain/credential.entity';
import { CredentialMapper } from './domain/credential.mapper';
import { CredentialAlreadyExistsForUserException } from './credentials.errors';

describe(CredentialsService.name, () => {
  let service: CredentialsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CredentialsService,
        {
          provide: PrismaService,
          useValue: {
            credential: {
              create: jest.fn(),
              update: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CredentialsService>(CredentialsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('Find Credentials by User ID', () => {
    it(`should be defined ${CredentialsService.prototype.findByUserId.name}`, () => {
      expect(service.findByUserId).toBeDefined();
    });

    it('should return a credential if found for user ID', async () => {
      const userId = faker.string.uuid();
      const mockId = faker.string.uuid();

      const credentialFound = generateSingleMockCredential({
        id: mockId,
        userId,
      });

      jest
        .spyOn(prismaService.credential, 'findUnique')
        .mockResolvedValue(credentialFound);

      const result = await service.findByUserId(UUIDFactory.from(userId));

      if (!result) {
        throw new Error('Credential not found');
      }

      expect(result).toBeDefined();
      expect(result.id).toEqual(UUIDFactory.from(mockId));
      expect(result.userId).toEqual(UUIDFactory.from(userId));
      expect(prismaService.credential.findUnique).toHaveBeenCalledWith({
        where: { userId },
      });
    });

    it('should return null if no credential found for user ID', async () => {
      const userId = faker.string.uuid();
      jest
        .spyOn(prismaService.credential, 'findUnique')
        .mockResolvedValue(null);

      const result = await service.findByUserId(UUIDFactory.from(userId));
      expect(result).toBeNull();
    });
  });

  describe('Create Credentials', () => {
    it(`should be defined ${CredentialsService.prototype.createCredential.name}`, () => {
      expect(service.createCredential).toBeDefined();
    });

    it('should create a new credential for a user', async () => {
      const mockId = faker.string.uuid();
      const userId = faker.string.uuid();
      const passwordHash = faker.string.alphanumeric(64);

      const credentialCreated = generateSingleMockCredential({
        id: mockId,
        userId,
        passwordHash,
      });

      const credentialEntity = CredentialEntity.create(
        UUIDFactory.from(mockId),
        UUIDFactory.from(userId),
        passwordHash,
      );

      jest
        .spyOn(prismaService.credential, 'create')
        .mockResolvedValue(credentialCreated);
      jest
        .spyOn(prismaService.credential, 'findUnique')
        .mockResolvedValue(null);

      const result = await service.createCredential(credentialEntity);

      expect(result).toEqual(CredentialMapper.toDomain(credentialCreated));
      expect(prismaService.credential.create).toHaveBeenCalledWith({
        data: {
          id: mockId,
          user: {
            connect: { id: userId },
          },
          passwordHash,
        },
      });
    });

    it('should throw an error if credential already exists for user', async () => {
      const mockId = faker.string.uuid();
      const userId = faker.string.uuid();
      const passwordHash = faker.string.alphanumeric(64);

      const credentialEntity = CredentialEntity.create(
        UUIDFactory.from(mockId),
        UUIDFactory.from(userId),
        passwordHash,
      );

      jest
        .spyOn(prismaService.credential, 'create')
        .mockRejectedValue(new CredentialAlreadyExistsForUserException());

      await expect(service.createCredential(credentialEntity)).rejects.toThrow(
        new CredentialAlreadyExistsForUserException(),
      );
    });
  });
});
