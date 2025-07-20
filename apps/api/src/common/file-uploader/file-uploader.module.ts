import { DynamicModule, Module } from '@nestjs/common';
import { UPLOADER_STRATEGY } from './domain/file-uploader.port';
import { S3UploaderStrategy } from './strategies/s3-uploader.strategy';
import { ConfigService } from '@nestjs/config';

@Module({})
export class FileUploaderModule {
  static registerS3(bucket: string): DynamicModule {
    return {
      module: FileUploaderModule,
      providers: [
        {
          provide: UPLOADER_STRATEGY,
          inject: [ConfigService],
          useFactory: (config: ConfigService) => {
            const region = config.get<string>('AWS_REGION')!;
            const accessKeyId = config.get<string>('AWS_ACCESS_KEY_ID')!;
            const secretAccessKey = config.get<string>(
              'AWS_SECRET_ACCESS_KEY',
            )!;

            return new S3UploaderStrategy(
              bucket,
              region,
              accessKeyId,
              secretAccessKey,
            );
          },
        },
      ],
      exports: [UPLOADER_STRATEGY],
    };
  }
}
