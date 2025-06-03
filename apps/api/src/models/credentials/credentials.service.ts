import { EmailAddress } from "src/common/entities/email/email.entity";
import { CredentialsRepository } from "./credentials.repository";
import { CredentialModel } from "./dto/credentials.model";
import { Injectable } from "@nestjs/common";
import { UUIDFactory } from "src/common/entities/uuid/uuid.factory";
import { UUID } from "src/common/entities/uuid/uuid.entity";
import { CreateCredentialDto } from "./dto/credentials.dto";
import { hashPassword } from "src/helpers/hash";

@Injectable()
export class CredentialsService {
  constructor(private readonly repository: CredentialsRepository) {}

  async getCredentialByEmail(email: EmailAddress): Promise<CredentialModel> {
    const credential = await this.repository.getByEmailOrThrow(email);
    return credential;
  }

  async createCredential(
    userId: UUID,
    payload: CreateCredentialDto,
  ): Promise<CredentialModel> {
    const id = UUIDFactory.create();
    const passwordHash = hashPassword(payload.password);

    return await this.repository.create({
      data: {
        id: id.toString(),
        email: payload.email.toString(),
        passwordHash,
        user: {
          connect: {
            id: userId.toString(),
          },
        },
      },
    });
  }
}
