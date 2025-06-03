import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { CredentialsRepository } from "./credentials.repository";
import { PrismaClient } from "@prisma/client";
import { Test } from "@nestjs/testing";
import { PrismaService } from "src/common/prisma/prisma.service";
import { faker } from "@faker-js/faker/.";

import { generateCredentialMock } from "./mocks/credential.mock";
import { EmailFactory } from "src/common/entities/email/email.factory";

const credentialsMock = generateCredentialMock(5);

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

  describe("getCredentialByEmail", () => {
    it("should find credential by email", async () => {
      // Arrange
      const mockedCredential = credentialsMock[0];
      const email = EmailFactory.from(mockedCredential.email);
      prismaService.credential.findUnique.mockResolvedValue(mockedCredential);

      // Act
      const findCredentialByEmail = () =>
        credentialsRepository.getByEmailOrThrow(email);

      // Assert
      await expect(findCredentialByEmail()).resolves.toBe(mockedCredential);
    });

    it("should return null if credential not found", async () => {
      // Arrange
      const email = EmailFactory.from(faker.internet.email());
      prismaService.credential.findUnique.mockResolvedValue(null);

      // Act
      const findCredentialByEmail = () =>
        credentialsRepository.getByEmail(email);

      // Assert
      await expect(findCredentialByEmail()).resolves.toBeNull();
    });
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
