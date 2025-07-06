import { Injectable, Logger } from '@nestjs/common';
import { Prisma, Profile } from '@prisma/client';

import { PrismaBaseService } from 'src/common/database/database-base.service';
import { PrismaService } from 'src/common/database/database.service';
import { UUID } from 'src/common/entities/uuid/uuid.entity';
import { ProfileEntity } from './domain/profile.entity';
import { ProfileMapper } from './domain/profile.mapper';
import { ProfileNotFoundException } from './profile.errors';

@Injectable()
export class ProfileService extends PrismaBaseService<Profile> {
  protected readonly modelName = 'profile';

  private readonly logger = new Logger(ProfileService.name);

  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  private async findUnique(
    where: Prisma.ProfileWhereUniqueInput,
  ): Promise<ProfileEntity | null> {
    const record = await this.client().profile.findUnique({ where });
    return record ? ProfileMapper.toDomain(record) : null;
  }

  async findUserById(userId: UUID): Promise<ProfileEntity | null> {
    const record = await this.findUnique({ userId: userId.value });

    if (record) {
      this.logger.debug(
        `[${this.modelName}] Profile found for userId=${userId.value}`,
      );
    }

    return record;
  }

  async findUserByIdOrThrow(userId: UUID): Promise<ProfileEntity> {
    const profile = await this.findUserById(userId);

    if (!profile) {
      throw new ProfileNotFoundException();
    }

    return profile;
  }
}
