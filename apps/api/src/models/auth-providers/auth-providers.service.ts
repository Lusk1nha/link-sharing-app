import { Injectable, Logger } from '@nestjs/common';
import { PrismaTransaction } from 'src/common/database/__types__/database.types';
import { PrismaService } from 'src/common/database/database.service';
import { AuthProviderEntity } from './domain/auth-providers.entity';
import { AuthProvider, Prisma } from '@prisma/client';
import { AuthProviderMapper } from './domain/auth-providers.mapper';
import {
  AuthProviderAlreadyExistsException,
  AuthProviderNotFoundForUserException,
} from './auth-providers.errors';
import { UUID } from 'src/common/entities/uuid/uuid.entity';
import { PrismaBaseService } from 'src/common/database/database-base.service';

@Injectable()
export class AuthProviderService extends PrismaBaseService<AuthProvider> {
  protected readonly modelName = 'authProvider';
  private readonly logger = new Logger(AuthProviderService.name);

  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  private async findMany(
    where: Prisma.AuthProviderWhereInput,
  ): Promise<AuthProviderEntity[]> {
    const records = await this.client().authProvider.findMany({ where });
    return records.map((record) => AuthProviderMapper.toDomain(record));
  }

  /**
   * Retrieves an auth provider by user ID, mapping to domain or returning null.
   */
  async findByUserIdOrThrow(userId: UUID): Promise<AuthProviderEntity[]> {
    const providers = await this.findMany({ userId: userId.value });

    if (providers.length === 0) {
      this.logger.warn(`No auth providers found for userId=${userId.value}`);
      throw new AuthProviderNotFoundForUserException();
    }

    return providers;
  }

  async createAuthProvider(
    authProvider: AuthProviderEntity,
    tx?: PrismaTransaction,
  ): Promise<AuthProviderEntity> {
    const client = this.client(tx);

    this.logger.log(
      `Attempting to create auth provider for userId=${authProvider.userId.value}, providerType=${authProvider.providerType}, providerId=${authProvider.providerId}`,
    );

    try {
      const record = await client.authProvider.create({
        data: {
          id: authProvider.id.value,
          userId: authProvider.userId.value,
          providerId: authProvider.providerId,
          providerType: authProvider.providerType,
        },
      });

      this.logger.log(
        `Auth provider created for userId=${authProvider.userId.value}, providerType=${authProvider.providerType}, providerId=${authProvider.providerId}`,
      );

      return AuthProviderMapper.toDomain(record);
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
