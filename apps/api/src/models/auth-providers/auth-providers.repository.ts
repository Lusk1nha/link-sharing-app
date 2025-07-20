import { Injectable } from '@nestjs/common';
import { Admin, PrismaClient } from '@prisma/client';
import { PrismaTransaction } from 'src/common/database/__types__/database.types';
import { PrismaBaseService } from 'src/common/database/database-base.service';
import { PrismaService } from 'src/common/database/database.service';
import { UUID } from 'src/common/entities/uuid/uuid.entity';
import { AuthProviderEntity } from './domain/auth-providers.entity';
import { AuthProviderMapper } from './domain/auth-providers.mapper';

@Injectable()
export class AuthProvidersRepository extends PrismaBaseService<Admin> {
  protected readonly modelName: keyof PrismaClient = 'authProvider';

  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async findByUserId(
    userId: UUID,
    tx?: PrismaTransaction,
  ): Promise<AuthProviderEntity[]> {
    const record = await this.client(tx).authProvider.findMany({
      where: { id: userId.value },
    });

    return record.map((r) => AuthProviderMapper.toDomain(r));
  }

  async create(
    authProvider: AuthProviderEntity,
    tx?: PrismaTransaction,
  ): Promise<AuthProviderEntity> {
    const record = await this.client(tx).authProvider.create({
      data: {
        id: authProvider.id.value,
        providerId: authProvider.providerId,
        userId: authProvider.userId.value,
        providerType: authProvider.providerType,
      },
    });

    return AuthProviderMapper.toDomain(record);
  }
}
