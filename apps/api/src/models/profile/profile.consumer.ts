import { Controller, Inject, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { User } from '@prisma/client';
import { ProfileService } from './profile.service';
import { UserMapper } from '../users/domain/user.mapper';
import {
  FileUploaderPort,
  UPLOADER_STRATEGY,
} from 'src/common/file-uploader/domain/file-uploader.port';

@Controller('profiles')
export class ProfileConsumer {
  private readonly logger = new Logger(ProfileConsumer.name);

  constructor(
    private readonly profileService: ProfileService,

    @Inject(UPLOADER_STRATEGY)
    private readonly uploader: FileUploaderPort,
  ) {}

  @EventPattern('auth.user.registered')
  async handleUserRegisteredEvent(user: User) {
    const userVo = UserMapper.toDomain(user);

    this.logger.log(`User registered: ${user.id}`);
    await this.profileService.createProfileForUser(userVo.id);
  }

  @EventPattern('user.deleted')
  async handleUserDeletedEvent(user: { id: string }) {
    await this.uploader.delete(user.id);
    this.logger.log(`User Avatar deleted: ${user.id} from storage`);
  }
}
