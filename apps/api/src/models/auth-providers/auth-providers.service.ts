import { Injectable, Logger } from '@nestjs/common';
import { PrismaTransaction } from 'src/common/database/__types__/database.types';

import { AuthProviderEntity } from './domain/auth-providers.entity';

import {
  AuthProviderAlreadyExistsException,
  AuthProviderNotFoundForUserException,
} from './auth-providers.errors';
import { UUID } from 'src/common/entities/uuid/uuid.entity';
import { AuthProvidersRepository } from './auth-providers.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthProviderService {
  protected readonly modelName = 'authProvider';
  private readonly logger = new Logger(AuthProviderService.name);

  constructor(protected readonly authProvidersRepo: AuthProvidersRepository) {}

  /**
   * Retrieves an auth provider by user ID, mapping to domain or returning null.
   */
  async findByUserIdOrThrow(userId: UUID): Promise<AuthProviderEntity[]> {
    const providers = await this.authProvidersRepo.findByUserId(userId);

    if (!providers || providers.length === 0) {
      this.logger.warn(`No auth provider found for userId=${userId.value}`);
      throw new AuthProviderNotFoundForUserException();
    }

    return providers;
  }

  async createAuthProvider(
    authProvider: AuthProviderEntity,
    tx?: PrismaTransaction,
  ): Promise<AuthProviderEntity> {
    this.logger.log(
      `Attempting to create auth provider for userId=${authProvider.userId.value}, providerType=${authProvider.providerType}, providerId=${authProvider.providerId}`,
    );

    try {
      const record = await this.authProvidersRepo.create(authProvider, tx);

      this.logger.log(
        `Auth provider created for userId=${authProvider.userId.value}, providerType=${authProvider.providerType}, providerId=${authProvider.providerId}`,
      );

      return record;
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002' &&
        (err.meta?.target as string[]).includes('unique_user_provider')
      ) {
        this.logger.error(
          `Unique constraint failed for auth provider: userId=${authProvider.userId.value}, providerType=${authProvider.providerType}, providerId=${authProvider.providerId}`,
        );
        throw new AuthProviderAlreadyExistsException();
      }

      this.logger.error(`Error creating auth provider: ${err.message}`);
      throw err;
    }
  }
}
