import { DeepMockProxy, mockDeep } from "jest-mock-extended";

import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";
import { Test } from "@nestjs/testing";
import { UserModel } from "./dto/users.model";
import { generateUserMock } from "./mocks/users.mock";

const usersMock = generateUserMock(10);

describe("UsersService", () => {
  let usersService: UsersService;
  let usersRepository: DeepMockProxy<UsersRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UsersRepository, UsersService],
    })
      .overrideProvider(UsersRepository)
      .useValue(mockDeep<UsersRepository>())
      .compile();

    usersService = moduleRef.get(UsersService);
    usersRepository = moduleRef.get(UsersRepository);
  });

  describe("getUsers", () => {
    it("should return all users", async () => {
      // Arrange
      usersRepository.getUsers.mockResolvedValue(
        usersMock.map((user) => new UserModel(user)),
      );

      // Act
      const getUsers = () => usersService.getUsers();

      // Assert
      await expect(getUsers()).resolves.toStrictEqual(
        usersMock.map((user) => new UserModel(user)),
      );
    });
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      // Arrange
      const mockedUser = generateUserMock(1)[0];
      usersRepository.create.mockResolvedValue(new UserModel(mockedUser));

      // Act
      const createUser = () => usersService.createUser();

      // Assert
      await expect(createUser()).resolves.toStrictEqual(
        new UserModel(mockedUser),
      );
    });
  });
});
