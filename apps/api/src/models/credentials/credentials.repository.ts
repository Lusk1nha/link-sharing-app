import { Injectable } from '@nestjs/common';
import { Credential, PrismaClient } from '@prisma/client';

import { PrismaTransaction } from 'src/common/database/__types__/database.types';
import { PrismaBaseService } from 'src/common/database/database-base.service';
import { PrismaService } from 'src/common/database/database.service';
import { UUID } from 'src/common/entities/uuid/uuid.entity';
import { CredentialMapper } from './domain/credential.mapper';
import { CredentialEntity } from './domain/credential.entity';

@Injectable()
export class CredentialsRepository extends PrismaBaseService<Credential> {
  protected readonly modelName: keyof PrismaClient = 'credential';

  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async findByUserId(userId: UUID, tx?: PrismaTransaction) {
    const record = await this.client(tx).credential.findUnique({
      where: { userId: userId.value },
    });

    return record ? CredentialMapper.toDomain(record) : null;
  }

  async create(
    credential: CredentialEntity,
    tx?: PrismaTransaction,
  ): Promise<CredentialEntity> {
    const record = await this.client(tx).credential.create({
      data: {
        id: credential.id.value,
        passwordHash: credential.passwordHash,
        user: {
          connect: {
            id: credential.userId.value,
          },
        },
      },
    });

    return CredentialMapper.toDomain(record);
  }

  async update(
    credential: CredentialEntity,
    tx?: PrismaTransaction,
  ): Promise<CredentialEntity> {
    const record = await this.client(tx).credential.update({
      where: { id: credential.id.value },
      data: {
        passwordHash: credential.passwordHash,
      },
    });

    return CredentialMapper.toDomain(record);
  }
}
