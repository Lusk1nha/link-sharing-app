import { Test } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { UsersRepository } from "./users.repository";

import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { PrismaService } from "src/common/prisma/prisma.service";
import { faker } from "@faker-js/faker/.";

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
