import { Injectable, Logger } from '@nestjs/common';

import { UUID } from 'src/common/entities/uuid/uuid.entity';

import { CredentialEntity } from './domain/credential.entity';

import {
  CredentialAlreadyExistsForUserException,
  CredentialNotFoundException,
} from './credentials.errors';
import { PrismaTransaction } from 'src/common/database/__types__/database.types';
import { CredentialsRepository } from './credentials.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class CredentialsService {
  private readonly logger = new Logger(CredentialsService.name);

  constructor(private readonly credentialsRepo: CredentialsRepository) {}

  private async updateUnique(
    credential: CredentialEntity,
    tx?: PrismaTransaction,
  ): Promise<CredentialEntity> {
    return this.credentialsRepo.update(credential, tx);
  }

  /**
   * Finds a credential by user ID, returning null if not found.
   */
  async findByUserId(userId: UUID): Promise<CredentialEntity | null> {
    return this.credentialsRepo.findByUserId(userId);
  }

  /**
   * Finds a credential by user ID or throws NotFound exception.
   */
  async findByUserIdOrThrow(userId: UUID): Promise<CredentialEntity> {
    const credential = await this.findByUserId(userId);

    if (!credential) {
      this.logger.warn(`No credential for userId=${userId.value}`);
      throw new CredentialNotFoundException();
    }

    return credential;
  }

  async createCredential(
    credential: CredentialEntity,
    tx?: PrismaTransaction,
  ): Promise<CredentialEntity> {
    this.logger.log(
      `Attempting to create credential for userId=${credential.userId.value}`,
    );

    try {
      const created = await this.credentialsRepo.create(credential, tx);

      this.logger.log(`Credential created with id=${created.id.value}`);
      return created;
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002' &&
        (err.meta?.target as string[]).includes('userId')
      ) {
        this.logger.error(
          `Credential already exists for userId=${credential.userId.value}`,
        );
        throw new CredentialAlreadyExistsForUserException();
      }

      this.logger.error(`Error creating credential: ${err.message}`);
      throw err;
    }
  }

  async updateCredentials(
    userId: UUID,
    hash: string,
  ): Promise<CredentialEntity> {
    this.logger.log(
      `Attempting to update credentials for userId=${userId.value}`,
    );

    return await this.updateUnique(
      CredentialEntity.patch(await this.findByUserIdOrThrow(userId), {
        passwordHash: hash,
      }),
    );
  }
}
