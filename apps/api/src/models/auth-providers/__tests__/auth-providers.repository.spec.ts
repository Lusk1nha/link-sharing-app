import { Test, TestingModule } from '@nestjs/testing';
import { AuthProvidersRepository } from '../auth-providers.repository';
import { PrismaService } from 'src/common/database/database.service';
import { generateMockAuthProviders } from '../__mock__/auth-providers.mock';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';
import { AuthProviderMapper } from '../domain/auth-providers.mapper';

describe(AuthProvidersRepository.name, () => {
  let authProvidersRepo: AuthProvidersRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthProvidersRepository,
        {
          provide: PrismaService,
          useValue: {
            authProvider: {
              findMany: jest.fn(),
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    authProvidersRepo = module.get<AuthProvidersRepository>(
      AuthProvidersRepository,
    );
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(authProvidersRepo).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of auth providers', async () => {
      const userId = UUIDFactory.create();

      const usersResult = generateMockAuthProviders(3, {
        userId: userId.value,
      });

      const usersResultVos = usersResult.map((u) =>
        AuthProviderMapper.toDomain(u),
      );

      jest
        .spyOn(prismaService.authProvider, 'findMany')
        .mockResolvedValue(usersResult);

      const authProviders = await authProvidersRepo.findByUserId(userId);
      expect(authProviders).toEqual(usersResultVos);
      expect(prismaService.authProvider.findMany).toHaveBeenCalledWith({
        where: { id: userId.value },
      });
      expect(authProviders.length).toBe(usersResultVos.length);
    });
  });
});
