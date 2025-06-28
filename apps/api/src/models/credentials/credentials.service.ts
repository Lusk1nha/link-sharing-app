import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/database/database.service';
import { UUID } from 'src/common/entities/uuid/uuid.entity';

import { CredentialEntity } from './domain/credential.entity';
import { CredentialMapper } from './domain/credential.mapper';
import {
  CredentialAlreadyExistsForUserException,
  CredentialNotFoundException,
} from './credentials.errors';
import { PrismaTransaction } from 'src/common/database/__types__/database.types';
import { Prisma } from '@prisma/client';

@Injectable()
export class CredentialsService {
  private readonly logger = new Logger(CredentialsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Resolves the Prisma client or transaction.
   */
  private client(tx?: PrismaTransaction) {
    return tx ?? this.prisma;
  }

  /**
   * Retrieves a credential by unique criteria, mapping to domain or returning null.
   */
  private async findUnique(
    where: Prisma.CredentialWhereUniqueInput,
  ): Promise<CredentialEntity | null> {
    const record = await this.prisma.credential.findUnique({ where });
    return record ? CredentialMapper.toDomain(record) : null;
  }

  /**
   * Finds a credential by user ID, returning null if not found.
   */
  async findByUserId(userId: UUID): Promise<CredentialEntity | null> {
    const credential = await this.findUnique({ userId: userId.value });

    if (credential) {
      this.logger.debug(`Credential found for userId=${userId.value}`);
    }

    return credential;
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

  /**
   * Creates a credential for a user. Throws if one already exists.
   */
  async createCredential(
    credential: CredentialEntity,
    tx?: PrismaTransaction,
  ): Promise<CredentialEntity> {
    const client = this.client(tx);
    this.logger.log(
      `Attempting to create credential for userId=${credential.userId.value}`,
    );

    try {
      const record = await client.credential.create({
        data: {
          id: credential.id.value,
          user: { connect: { id: credential.userId.value } },
          passwordHash: credential.passwordHash,
        },
      });
      this.logger.log(`Credential created with id=${record.id}`);
      return CredentialMapper.toDomain(record);
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
}
