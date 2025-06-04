import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { CredentialsService } from "../credentials/credentials.service";
import { AuthProvidersService } from "../auth-providers/auth-providers.service";
import { Test } from "@nestjs/testing";
import { faker } from "@faker-js/faker";
import { EmailFactory } from "src/common/entities/email/email.factory";
import { generateOneUserMock } from "../users/mocks/users.mock";
import { UserModel } from "../users/dto/users.model";
import { CredentialModel } from "../credentials/dto/credentials.model";
import { generateOneCredentialMock } from "../credentials/mocks/credential.mock";
import { generateOneAuthProviderMock } from "../auth-providers/mocks/auth-provider.mock";
import { AuthProviderModel } from "../auth-providers/dto/auth-provider.model";
import { AuthEmailAlreadyInUseException } from "./dto/auth.errors";
import { SessionsModule } from "../sessions/sessions.module";
import { SessionsService } from "../sessions/sessions.service";
import { generateOneSessionMock } from "../sessions/mocks/sessions.mock";
import { JwtModule, JwtService } from "@nestjs/jwt";

describe("AuthService", () => {
  let authService: AuthService;
  let usersService: DeepMockProxy<UsersService>;
  let credentialsService: DeepMockProxy<CredentialsService>;
  let authProvidersService: DeepMockProxy<AuthProvidersService>;
  let sessionsService: DeepMockProxy<SessionsService>;
  let jwtService: DeepMockProxy<JwtService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockDeep<UsersService>(),
        },
        {
          provide: CredentialsService,
          useValue: mockDeep<CredentialsService>(),
        },
        {
          provide: AuthProvidersService,
          useValue: mockDeep<AuthProvidersService>(),
        },
        {
          provide: SessionsService,
          useValue: mockDeep<SessionsService>(),
        },
        {
          provide: JwtService,
          useValue: mockDeep<JwtService>(),
        },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
    usersService = moduleRef.get(UsersService);
    credentialsService = moduleRef.get(CredentialsService);
    authProvidersService = moduleRef.get(AuthProvidersService);
    sessionsService = moduleRef.get(SessionsService);
    jwtService = moduleRef.get(JwtService);

    jest.clearAllMocks();
  });

  describe("signUp", () => {
    it("should register a new user with credentials", async () => {
      // Arrange
      const email = EmailFactory.from(faker.internet.email());
      const password = faker.internet.password();

      const mockedUser = generateOneUserMock();
      const userModel = new UserModel(mockedUser);

      const mockedCredential = generateOneCredentialMock();
      const credentialModel = new CredentialModel(mockedCredential);

      const mockedAuthProvider = generateOneAuthProviderMock();
      const authProviderModel = new AuthProviderModel(mockedAuthProvider);

      usersService.createUser.mockResolvedValue(userModel);
      credentialsService.getCredentialByEmail.mockResolvedValue(null);
      credentialsService.createCredential.mockResolvedValue(credentialModel);
      authProvidersService.createAuthProvider.mockResolvedValue(
        authProviderModel,
      );
      sessionsService.generateTokenByUser.mockResolvedValue({
        accessToken: generateOneSessionMock(),
        refreshToken: generateOneSessionMock(),
      });

      // Act
      const user = await authService.signUp(email, password);

      // Assert
      expect(usersService.createUser).toHaveBeenCalled();
      expect(credentialsService.createCredential).toHaveBeenCalledWith(
        user.id,
        { email, password },
      );
      expect(authProvidersService.createAuthProvider).toHaveBeenCalledWith(
        user.id,
        { type: "CREDENTIALS" },
      );
    });

    it("should throw an error if email is not unique", async () => {
      // Arrange
      const email = EmailFactory.from(faker.internet.email());
      const password = faker.internet.password();

      credentialsService.getCredentialByEmail.mockResolvedValue(
        new CredentialModel(
          generateOneCredentialMock({ email: email.value() }),
        ),
      );

      // Act
      const signUp = () => authService.signUp(email, password);

      // Assert
      await expect(signUp).rejects.toThrow(
        new AuthEmailAlreadyInUseException(),
      );
    });
  });

  describe("signIn", () => {
    it("should sign in a user with valid credentials", async () => {
      // Arrange
      const email = EmailFactory.from(faker.internet.email());
      const password = faker.internet.password();

      const mockedUser = generateOneUserMock();
      const userModel = new UserModel(mockedUser);

      const mockedCredential = generateOneCredentialMock();
      const credentialModel = new CredentialModel(mockedCredential);

      usersService.getUserByIdOrThrow.mockResolvedValue(userModel);
      credentialsService.getCredentialByEmail.mockResolvedValue(
        credentialModel,
      );
      credentialsService.validatePasswordHash.mockResolvedValue(true);

      // Act
      await authService.signIn(email, password);

      // Assert
      expect(usersService.getUserByIdOrThrow).toHaveBeenCalledWith(
        credentialModel.userId,
      );
      expect(credentialsService.getCredentialByEmail).toHaveBeenCalledWith(
        email,
      );
      expect(credentialsService.validatePasswordHash).toHaveBeenCalledWith(
        password,
        credentialModel.passwordHash,
      );
    });
  });
});
