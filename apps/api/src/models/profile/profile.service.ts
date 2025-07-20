import { Inject, Injectable, Logger } from '@nestjs/common';
import { UUID } from 'src/common/entities/uuid/uuid.entity';
import { ProfileEntity } from './domain/profile.entity';
import { ProfileRepository } from './profile.repository';
import { ProfileNotFoundException } from './profile.errors';

import {
  FileUploaderPort,
  UPLOADER_STRATEGY,
} from 'src/common/file-uploader/domain/file-uploader.port';
import { PutObjectCommandInput } from '@aws-sdk/client-s3';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    private readonly profileRepo: ProfileRepository,

    @Inject(UPLOADER_STRATEGY)
    private readonly uploader: FileUploaderPort,
  ) {}

  async findUserById(userId: UUID): Promise<ProfileEntity | null> {
    const profile = await this.profileRepo.findByUserId(userId);
    if (profile) {
      this.logDebug(`Profile found for userId=${userId.value}`);
    }
    return profile;
  }

  async findUserByIdOrThrow(userId: UUID): Promise<ProfileEntity> {
    const profile = await this.findUserById(userId);
    if (!profile) throw new ProfileNotFoundException();
    return profile;
  }

  async createProfileForUser(userId: UUID): Promise<ProfileEntity> {
    const profile = await this.profileRepo.create(userId);
    this.logDebug(`Profile created for userId=${userId.value}`);
    return profile;
  }

  async updateAvatar(
    userId: UUID,
    file: Express.Multer.File,
  ): Promise<ProfileEntity> {
    const imageUrl = await this.uploader.upload<PutObjectCommandInput>(
      userId.value,
      file.buffer,
      file.mimetype,
      { ACL: 'public-read' },
    );

    const updatedProfile = await this.profileRepo.updateAvatar(
      userId,
      imageUrl,
    );

    this.logDebug(`Avatar updated for userId=${userId.value}`);
    return updatedProfile;
  }

  private logDebug(message: string) {
    this.logger.debug(`[Profile] ${message}`);
  }
}
