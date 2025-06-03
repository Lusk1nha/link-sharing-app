import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/common/prisma/prisma.service";
import { UserDto } from "./dto/users.model";
import { UUID } from "src/common/entities/uuid/uuid.entity";
import { UserNotFoundException } from "./dto/users.errors";

interface CreateUserParams {
  data: Prisma.UserCreateInput;
}

interface GetAllUsersParams {
  skip?: number;
  take?: number;
  cursor?: Prisma.UserWhereUniqueInput;
  where?: Prisma.UserWhereInput;
  orderBy?: Prisma.UserOrderByWithRelationInput;
}

interface IUserRepository {
  getUserById(id: UUID): Promise<UserDto | null>;
  getUserByIdOrThrow(id: UUID): Promise<UserDto>;
  getUsers(params: GetAllUsersParams): Promise<UserDto[]>;
  create(params: CreateUserParams): Promise<UserDto>;
}

@Injectable()
export class UsersRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(id: UUID): Promise<UserDto | null> {
    return this.prisma.user.findUnique({
      where: { id: id.toString() },
    });
  }

  async getUserByIdOrThrow(id: UUID): Promise<UserDto> {
    const user = await this.getUserById(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async getUsers(params: GetAllUsersParams): Promise<UserDto[]> {
    const { skip, take, cursor, where, orderBy } = params;

    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async create(params: CreateUserParams): Promise<UserDto> {
    const { data } = params;

    return this.prisma.user.create({
      data,
    });
  }
}
