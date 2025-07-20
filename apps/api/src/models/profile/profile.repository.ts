import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/database.service';
import { UUID } from 'src/common/entities/uuid/uuid.entity';
import { Profile } from '@prisma/client';

import { ProfileEntity } from './domain/profile.entity';
import { ProfileMapper } from './domain/profile.mapper';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';
import { PrismaBaseService } from 'src/common/database/database-base.service';
import { PrismaTransaction } from 'src/common/database/__types__/database.types';

@Injectable()
export class ProfileRepository extends PrismaBaseService<Profile> {
  protected readonly modelName = 'profile';

  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async findByUserId(
    userId: UUID,
    tx?: PrismaTransaction,
  ): Promise<ProfileEntity | null> {
    const record = await this.client(tx).profile.findUnique({
      where: { userId: userId.value },
    });
    return record ? ProfileMapper.toDomain(record) : null;
  }

  async create(userId: UUID, tx?: PrismaTransaction): Promise<ProfileEntity> {
    const profileVo = ProfileEntity.create(UUIDFactory.create(), userId);

    const created = await this.client(tx).profile.create({
      data: {
        id: profileVo.id.value,
        userId: userId.value,
      },
    });

    return ProfileMapper.toDomain(created);
  }

  async updateAvatar(
    userId: UUID,
    imageUrl: string,
    tx?: PrismaTransaction,
  ): Promise<ProfileEntity> {
    const updated = await this.client(tx).profile.update({
      where: { userId: userId.value },
      data: { imageUrl },
    });

    return ProfileMapper.toDomain(updated);
  }
}
