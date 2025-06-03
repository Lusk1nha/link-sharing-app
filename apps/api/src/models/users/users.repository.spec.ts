import { Test } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { UsersRepository } from "./users.repository";

import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { PrismaService } from "src/common/prisma/prisma.service";
import { faker } from "@faker-js/faker/.";
import { generateUserMock } from "./mocks/users.mock";
import { UUIDFactory } from "src/common/entities/uuid/uuid.factory";

const usersMock = generateUserMock(5);

describe("UsersRepository", () => {
  let usersRepository: UsersRepository;
  let prismaService: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UsersRepository, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    usersRepository = moduleRef.get(UsersRepository);
    prismaService = moduleRef.get(PrismaService);
  });

  describe("getUserById", () => {
    it("should find user by id", async () => {
      // Arrange
      const mockedUser = usersMock[0];
      const userId = UUIDFactory.from(mockedUser.id);
      prismaService.user.findUnique.mockResolvedValue(mockedUser);

      // Act
      const findUserById = () => usersRepository.getUserByIdOrThrow(userId);

      // Assert
      await expect(findUserById()).resolves.toBe(mockedUser);
    });

    it("should return null if user not found", async () => {
      // Arrange
      const userId = UUIDFactory.from(faker.string.uuid());
      prismaService.user.findUnique.mockResolvedValue(null);

      // Act
      const findUserById = () => usersRepository.getUserById(userId);

      // Assert
      await expect(findUserById()).resolves.toBeNull();
    });
  });

  describe("getUsers", () => {
    it("should return all users", async () => {
      // Arrange
      const mockedUsers = usersMock;
      prismaService.user.findMany.mockResolvedValue(mockedUsers);

      // Act
      const getAllUsers = () => usersRepository.getUsers({});

      // Assert
      await expect(getAllUsers()).resolves.toEqual(mockedUsers);
    });
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      // Arrange
      const mockedUser = {
        id: faker.string.uuid(),
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaService.user.create.mockResolvedValue(mockedUser);

      // Act
      const createUser = () =>
        usersRepository.create({
          data: {
            id: mockedUser.id,
            active: mockedUser.active,
            createdAt: mockedUser.createdAt,
            updatedAt: mockedUser.updatedAt,
          },
        });

      // Assert
      await expect(createUser()).resolves.toBe(mockedUser);
    });
  });
});
