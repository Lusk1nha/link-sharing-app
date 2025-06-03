import { CredentialsService } from "./credentials.service";
import { Test } from "@nestjs/testing";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";

import {
  generateCredentialMock,
  generateOneCredentialMock,
} from "./mocks/credential.mock";
import { CredentialsRepository } from "./credentials.repository";
import { CredentialModel } from "./dto/credentials.model";
import { CreateCredentialDto } from "./dto/credentials.dto";
import { EmailFactory } from "src/common/entities/email/email.factory";
import { UUIDFactory } from "src/common/entities/uuid/uuid.factory";

const credentialsMock = generateCredentialMock(5);

describe("CredentialsService", () => {
  let credentialsService: CredentialsService;
  let credentialsRepository: DeepMockProxy<CredentialsRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CredentialsRepository, CredentialsService],
    })
      .overrideProvider(CredentialsRepository)
      .useValue(mockDeep<CredentialsRepository>())
      .compile();

    credentialsService = moduleRef.get(CredentialsService);
    credentialsRepository = moduleRef.get(CredentialsRepository);
  });

  describe("getCredentialByEmail", () => {
    it("should find credential by email", async () => {
      // Arrange
      const mockedCredential = new CredentialModel(generateOneCredentialMock());
      credentialsRepository.getByEmailOrThrow.mockResolvedValue(
        mockedCredential,
      );

      // Act
      const findCredentialByEmail = () =>
        credentialsService.getCredentialByEmail(mockedCredential.email);

      // Assert
      await expect(findCredentialByEmail()).resolves.toStrictEqual(
        mockedCredential,
      );
    });
  });

  describe("createCredential", () => {
    it("should create a new credential", async () => {
      // Arrange
      const mockedCredential = {
        ...generateOneCredentialMock(),
        email: "test@example.com",
        passwordHash: "teste",
      };

      const userId = UUIDFactory.from(mockedCredential.userId);
      const email = EmailFactory.from(mockedCredential.email);

      credentialsRepository.create.mockResolvedValue(
        new CredentialModel(mockedCredential),
      );

      // Act
      const createCredentialPayload: CreateCredentialDto = {
        email,
        password: "hashed2Password",
      };

      const createCredential = () =>
        credentialsService.createCredential(userId, createCredentialPayload);

      // Assert
      await expect(createCredential()).resolves.toStrictEqual(
        new CredentialModel(mockedCredential),
      );
    });
  });
});
