import { EmailAddress } from "src/common/entities/email/email.entity";
import { CredentialsRepository } from "./credentials.repository";
import { CredentialModel } from "./dto/credentials.model";
import { Injectable, Logger } from "@nestjs/common";
import { UUIDFactory } from "src/common/entities/uuid/uuid.factory";
import { UUID } from "src/common/entities/uuid/uuid.entity";
import { CreateCredentialDto } from "./dto/credentials.dto";
import { comparePassword, hashPassword } from "src/helpers/hash";

@Injectable()
export class CredentialsService {
  private readonly logger = new Logger(CredentialsService.name);

  constructor(private readonly repository: CredentialsRepository) {}

  async getCredentialByEmailOrThrow(
    email: EmailAddress,
  ): Promise<CredentialModel> {
    const credential = await this.repository.getByEmailOrThrow(email);
    return credential;
  }

  async getCredentialByEmail(
    email: EmailAddress,
  ): Promise<CredentialModel | null> {
    const credential = await this.repository.getByEmail(email);
    return credential;
  }

  async createCredential(
    userId: UUID,
    payload: CreateCredentialDto,
  ): Promise<CredentialModel> {
    const id = UUIDFactory.create();
    const passwordHash = hashPassword(payload.password);

    const credential = await this.repository.create({
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

    this.logger.log(
      `Credential created | userId=${userId.toString()} | email=${payload.email.toString()}`,
    );

    return credential;
  }

  async validatePassword(
    email: EmailAddress,
    password: string,
  ): Promise<boolean> {
    const credentials = await this.getCredentialByEmailOrThrow(email);

    const isValid = await comparePassword(password, credentials.passwordHash);

    return isValid;
  }
}
