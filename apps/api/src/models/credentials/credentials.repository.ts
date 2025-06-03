import { Prisma } from "@prisma/client";
import { PrismaService } from "src/common/prisma/prisma.service";
import { CredentialDto, CredentialModel } from "./dto/credentials.model";
import { Injectable } from "@nestjs/common";
import { EmailAddress } from "src/common/entities/email/email.entity";
import { NotFoundCredentialException } from "./dto/credentials.errors";

interface CreateCredentialParams {
  data: Prisma.CredentialCreateInput;
}

interface UpdateCredentialParams {
  data: Prisma.CredentialUpdateInput;
  where: Prisma.CredentialWhereUniqueInput;
}

interface ICredentialsRepository {
  getByEmail(email: EmailAddress): Promise<CredentialModel | null>;
  getByEmailOrThrow(email: EmailAddress): Promise<CredentialModel>;
  create(params: CreateCredentialParams): Promise<CredentialModel>;
  update(params: UpdateCredentialParams): Promise<CredentialModel>;
}

@Injectable()
export class CredentialsRepository implements ICredentialsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getByEmail(email: EmailAddress): Promise<CredentialModel | null> {
    const response = await this.prisma.credential.findUnique({
      where: {
        email: email.toString(),
      },
    });

    if (!response) {
      return null;
    }

    return new CredentialModel(response);
  }

  async getByEmailOrThrow(email: EmailAddress): Promise<CredentialModel> {
    const credential = await this.getByEmail(email);

    if (!credential) {
      throw new NotFoundCredentialException();
    }

    return credential;
  }

  async create(params: CreateCredentialParams): Promise<CredentialModel> {
    const { data } = params;

    const response = await this.prisma.credential.create({
      data,
    });

    return new CredentialModel(response);
  }

  async update(params: UpdateCredentialParams): Promise<CredentialModel> {
    const { data, where } = params;

    const response = await this.prisma.credential.update({
      data,
      where,
    });

    return new CredentialModel(response);
  }
}
