import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { CredentialsRepository } from "./credentials.repository";
import { PrismaClient } from "@prisma/client";
import { Test } from "@nestjs/testing";
import { PrismaService } from "src/common/prisma/prisma.service";
import { faker } from "@faker-js/faker";

import {
  generateCredentialMock,
  generateOneCredentialMock,
} from "./mocks/credential.mock";
import { EmailFactory } from "src/common/entities/email/email.factory";
import { CredentialModel } from "./dto/credentials.model";

describe("CredentialsRepository", () => {
  let credentialsRepository: CredentialsRepository;
  let prismaService: DeepMockProxy<PrismaClient>;

  const credentialsMock = generateCredentialMock(5);
  const mockedCredential = credentialsMock[0];

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

  describe("getByEmailOrThrow", () => {
    it("should return credential model when found", async () => {
      const email = EmailFactory.from(mockedCredential.email);
      prismaService.credential.findUnique.mockResolvedValue(mockedCredential);

      const result = await credentialsRepository.getByEmailOrThrow(email);

      expect(prismaService.credential.findUnique).toHaveBeenCalledWith({
        where: { email: email.toString() },
      });
      expect(result).toStrictEqual(new CredentialModel(mockedCredential));
    });
  });

  describe("getByEmail", () => {
    it("should return null when credential not found", async () => {
      const email = EmailFactory.from(faker.internet.email());
      prismaService.credential.findUnique.mockResolvedValue(null);

      const result = await credentialsRepository.getByEmail(email);

      expect(prismaService.credential.findUnique).toHaveBeenCalledWith({
        where: { email: email.toString() },
      });
      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create and return a credential", async () => {
      const newCredential = generateOneCredentialMock();
      prismaService.credential.create.mockResolvedValue(newCredential);

      const result = await credentialsRepository.create({
        data: {
          id: newCredential.id,
          user: {
            connect: { id: newCredential.userId },
          },
          email: newCredential.email,
          passwordHash: newCredential.passwordHash,
          createdAt: newCredential.createdAt,
          updatedAt: newCredential.updatedAt,
        },
      });

      expect(prismaService.credential.create).toHaveBeenCalledWith({
        data: {
          id: newCredential.id,
          user: {
            connect: { id: newCredential.userId },
          },
          email: newCredential.email,
          passwordHash: newCredential.passwordHash,
          createdAt: newCredential.createdAt,
          updatedAt: newCredential.updatedAt,
        },
      });
      expect(result).toStrictEqual(new CredentialModel(newCredential));
    });
  });
});
