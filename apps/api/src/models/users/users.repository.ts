import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/common/prisma/prisma.service";
import { UserDto, UserModel } from "./dto/users.model";
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
  getUserById(id: UUID): Promise<UserModel | null>;
  getUserByIdOrThrow(id: UUID): Promise<UserModel>;
  getUsers(params: GetAllUsersParams): Promise<UserModel[]>;
  create(params: CreateUserParams): Promise<UserModel>;
}

@Injectable()
export class UsersRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(id: UUID): Promise<UserModel | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: id.value() },
    });

    if (!user) {
      return null;
    }

    return new UserModel(user);
  }

  async getUserByIdOrThrow(id: UUID): Promise<UserModel> {
    const user = await this.getUserById(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async getUsers(params: GetAllUsersParams): Promise<UserModel[]> {
    const { skip, take, cursor, where, orderBy } = params;

    const users = await this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });

    return users.map((user) => new UserModel(user));
  }

  async create(params: CreateUserParams): Promise<UserModel> {
    const { data } = params;

    const user = await this.prisma.user.create({
      data,
    });

    return new UserModel(user);
  }
}
