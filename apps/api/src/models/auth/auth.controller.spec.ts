import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { faker } from "@faker-js/faker";
import {
  LoginPayloadDto,
  RegisterPayloadDto,
  RegisterResponseDto,
} from "./dto/auth.dto";
import { generateOneUserMock } from "../users/mocks/users.mock";
import { UserModel } from "../users/dto/users.model";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { EmailFactory } from "src/common/entities/email/email.factory";
import { generateOneSessionMock } from "../sessions/mocks/sessions.mock";

describe("AuthController", () => {
  let authController: AuthController;
  let authService: DeepMockProxy<AuthService>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockDeep<AuthService>(),
        },
      ],
    }).compile();

    authController = moduleRef.get(AuthController);
    authService = moduleRef.get(AuthService);

    jest.clearAllMocks();
  });

  describe("signUp", () => {
    it("should register a new user and return it", async () => {
      // Arrange
      const registerPayload: RegisterPayloadDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const { email, password } = registerPayload;
      const emailEntity = EmailFactory.from(email);

      const userMock = generateOneUserMock();
      const userModel = new UserModel(userMock);

      authService.signUp.mockResolvedValue(userModel);

      const expectedResponse: RegisterResponseDto = {
        user: userModel,
      };

      // Act
      const result = await authController.register(registerPayload);

      // Assert
      expect(result).toStrictEqual(expectedResponse);
      expect(authService.signUp).toHaveBeenCalledTimes(1);
      expect(authService.signUp).toHaveBeenCalledWith(emailEntity, password);
    });
  });

  describe("login", () => {
    it("should log in a user and return a success message", async () => {
      // Arrange
      const loginPayload: LoginPayloadDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const { email, password } = loginPayload;
      const emailEntity = EmailFactory.from(email);

      const accessToken = generateOneSessionMock();
      const refreshToken = generateOneSessionMock();

      authService.signIn.mockResolvedValue({ accessToken, refreshToken });

      const request = { cookie: jest.fn() };

      // Act
      await authController.login(request, loginPayload);

      // Assert
      expect(authService.signIn).toHaveBeenCalledTimes(1);
      expect(authService.signIn).toHaveBeenCalledWith(emailEntity, password);
      expect(request.cookie).toHaveBeenCalledTimes(1);
    });
  });
});
