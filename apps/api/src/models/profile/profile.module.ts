import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { PrismaService } from 'src/common/database/database.service';
import { FileUploaderModule } from 'src/common/file-uploader/file-uploader.module';
import { ProfileConsumer } from './profile.consumer';
import { ProfileRepository } from './profile.repository';

@Module({
  imports: [FileUploaderModule.registerS3(process.env.AWS_S3_BUCKET!)],
  controllers: [ProfileController, ProfileConsumer],
  providers: [ProfileService, ProfileRepository, PrismaService],
  exports: [ProfileService],
})
export class ProfileModule {}
