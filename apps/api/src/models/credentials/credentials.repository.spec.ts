import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { CredentialsRepository } from "./credentials.repository";
import { PrismaClient } from "@prisma/client";
import { Test } from "@nestjs/testing";
import { PrismaService } from "src/common/prisma/prisma.service";
import { faker } from "@faker-js/faker/.";
import { CredentialDto } from "./dto/credentials.model";

const credentialsMock: CredentialDto[] = [
  {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    email: faker.internet.email(),
    passwordHash: faker.string.alphanumeric(64),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    email: faker.internet.email(),
    passwordHash: faker.string.alphanumeric(64),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe("CredentialsRepository", () => {
  let credentialsRepository: CredentialsRepository;
  let prismaService: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CredentialsRepository, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    credentialsRepository = moduleRef.get(CredentialsRepository);
    prismaService = moduleRef.get(PrismaService);
  });

  describe("createCredential", () => {
    it("should create credential", async () => {
      // Arrange
      const mockedCredential = {
        id: faker.string.uuid(),
        userId: faker.string.uuid(),
        email: faker.internet.email(),
        passwordHash: faker.string.alphanumeric(64),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prismaService.credential.create.mockResolvedValue(mockedCredential);

      // Act
      const createCredential = () =>
        credentialsRepository.create({
          data: {
            id: mockedCredential.id,
            user: {
              connect: { id: mockedCredential.userId },
            },
            email: mockedCredential.email,
            passwordHash: mockedCredential.passwordHash,
            createdAt: mockedCredential.createdAt,
            updatedAt: mockedCredential.updatedAt,
          },
        });

      // Assert
      await expect(createCredential()).resolves.toBe(mockedCredential);
    });
  });
});
