import { EmailAddress } from "src/common/entities/email/email.entity";
import { CredentialsRepository } from "./credentials.repository";
import { CredentialModel } from "./dto/credentials.model";
import { Injectable, Logger } from "@nestjs/common";
import { UUIDFactory } from "src/common/entities/uuid/uuid.factory";
import { UUID } from "src/common/entities/uuid/uuid.entity";
import { CreateCredentialDto } from "./dto/credentials.dto";

import { CredentialsHasherService } from "./credentials-hasher.service";

@Injectable()
export class CredentialsService {
  private readonly logger = new Logger(CredentialsService.name);

  constructor(
    private readonly repository: CredentialsRepository,
    private readonly hasher: CredentialsHasherService,
  ) {}

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
    const passwordHash = await this.hasher.hash(payload.password);

    const credential = await this.repository.create({
      data: {
        id: id.value(),
        email: payload.email.value(),
        passwordHash,
        user: {
          connect: {
            id: userId.value(),
          },
        },
      },
    });

    this.logger.log(
      `Credential created | userId=${userId.value()} | email=${payload.email.value()}`,
    );

    return credential;
  }

  async validatePasswordHash(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    return await this.hasher.compare(password, passwordHash);
  }
}
