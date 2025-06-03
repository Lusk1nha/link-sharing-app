import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { AuthProvidersRepository } from "./auth-providers.repository";
import { PrismaClient } from "@prisma/client";
import { PrismaService } from "src/common/prisma/prisma.service";
import { Test } from "@nestjs/testing";
import { generateAuthProviderMock } from "./mocks/auth-provider.mock";
import { AuthProviderModel } from "./dto/auth-provider.model";
import { UUIDFactory } from "src/common/entities/uuid/uuid.factory";

describe("AuthProvidersRepository", () => {
  let authProvidersRepository: AuthProvidersRepository;
  let prismaService: DeepMockProxy<PrismaClient>;

  const authProvidersMock = generateAuthProviderMock(5);
  const [firstMock] = authProvidersMock;
  const userId = UUIDFactory.from(firstMock.userId);

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AuthProvidersRepository, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    authProvidersRepository = moduleRef.get(AuthProvidersRepository);
    prismaService = moduleRef.get(PrismaService);
  });

  describe("getByUserId", () => {
    it("should return all auth providers for a given user ID", async () => {
      prismaService.authProvider.findMany.mockResolvedValue(authProvidersMock);

      const result = await authProvidersRepository.getByUserId(userId);

      expect(prismaService.authProvider.findMany).toHaveBeenCalledWith({
        where: { userId: userId.toString() },
      });

      expect(result).toStrictEqual(
        authProvidersMock.map((item) => new AuthProviderModel(item)),
      );
    });
  });

  describe("create", () => {
    it("should create and return a new auth provider", async () => {
      prismaService.authProvider.create.mockResolvedValue(firstMock);

      const result = await authProvidersRepository.create({
        data: {
          id: firstMock.id,
          user: { connect: { id: firstMock.userId } },
          type: firstMock.type,
        },
      });

      expect(prismaService.authProvider.create).toHaveBeenCalledWith({
        data: {
          id: firstMock.id,
          user: { connect: { id: firstMock.userId } },
          type: firstMock.type,
        },
      });

      expect(result).toStrictEqual(new AuthProviderModel(firstMock));
      expect(result).toBeInstanceOf(AuthProviderModel);
    });
  });
});
