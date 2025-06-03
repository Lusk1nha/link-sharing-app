import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/common/prisma/prisma.service";
import { UserDto } from "./users.model";

interface CreateUserParams {
  data: Prisma.UserCreateInput;
}

interface IUserRepository {
  create(params: CreateUserParams): Promise<UserDto>;
}

@Injectable()
export class UsersRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(params: CreateUserParams): Promise<UserDto> {
    const { data } = params;

    return this.prisma.user.create({
      data,
    });
  }
}
