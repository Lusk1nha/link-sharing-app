import { Prisma } from "@prisma/client";
import { PrismaService } from "src/common/prisma/prisma.service";
import { CredentialDto } from "./dto/credentials.model";
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
  getByEmail(email: EmailAddress): Promise<CredentialDto | null>;
  getByEmailOrThrow(email: EmailAddress): Promise<CredentialDto>;
  create(params: CreateCredentialParams): Promise<CredentialDto>;
  update(params: UpdateCredentialParams): Promise<CredentialDto>;
}

@Injectable()
export class CredentialsRepository implements ICredentialsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getByEmail(email: EmailAddress): Promise<CredentialDto | null> {
    return this.prisma.credential.findUnique({
      where: {
        email: email.toString(),
      },
    });
  }

  async getByEmailOrThrow(email: EmailAddress): Promise<CredentialDto> {
    const credential = await this.getByEmail(email);

    if (!credential) {
      throw new NotFoundCredentialException();
    }

    return credential;
  }

  async create(params: CreateCredentialParams): Promise<CredentialDto> {
    const { data } = params;

    return this.prisma.credential.create({
      data,
    });
  }

  async update(params: UpdateCredentialParams): Promise<CredentialDto> {
    const { data, where } = params;

    return this.prisma.credential.update({
      data,
      where,
    });
  }
}
