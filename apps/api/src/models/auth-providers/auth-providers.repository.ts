import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { UUID } from "src/common/entities/uuid/uuid.entity";
import { AuthProviderModel } from "./dto/auth-provider.model";
import { PrismaService } from "src/common/prisma/prisma.service";

interface CreateAuthProviderParams {
  data: Prisma.AuthProviderCreateInput;
}

interface IAuthProvidersRepository {
  getByUserId(userId: UUID): Promise<AuthProviderModel[] | null>;

  create(params: CreateAuthProviderParams): Promise<AuthProviderModel>;
}

@Injectable()
export class AuthProvidersRepository implements IAuthProvidersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getByUserId(userId: UUID): Promise<AuthProviderModel[] | null> {
    const response = await this.prisma.authProvider.findMany({
      where: {
        userId: userId.toString(),
      },
    });

    return response?.map((item) => new AuthProviderModel(item));
  }

  async create(params: CreateAuthProviderParams): Promise<AuthProviderModel> {
    const { data } = params;

    const response = await this.prisma.authProvider.create({
      data,
    });

    return new AuthProviderModel(response);
  }
}
