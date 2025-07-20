import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { FileUploaderPort } from '../domain/file-uploader.port';

import { Readable } from 'stream';

@Injectable()
export class S3UploaderStrategy
  implements FileUploaderPort, OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(S3UploaderStrategy.name);

  private readonly client: S3Client;
  readonly bucketName: string;

  constructor(
    bucket: string,
    region: string,
    accessKeyId: string,
    secretAccessKey: string,
  ) {
    this.bucketName = bucket;

    this.client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  onModuleInit() {
    this.logger.log(
      `S3UploaderStrategy initialized for bucket: ${this.bucketName}`,
    );
  }

  onModuleDestroy() {
    this.logger.log(`S3UploaderStrategy is being destroyed`);
    this.client.destroy();
  }

  async upload<T extends PutObjectCommandInput>(
    key: string,
    body: Buffer | Uint8Array | Blob | string | Readable,
    contentType: string,
    options?: Partial<T>,
  ): Promise<string> {
    const region = await this.client.config.region();

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
      ...options,
    });

    await this.client.send(command);

    this.logger.log(
      `File uploaded: ${key} to bucket ${this.bucketName} in region ${region}`,
    );

    return `https://${this.bucketName}.s3.${region}.amazonaws.com/${key}`;
  }

  async delete<T extends DeleteObjectCommandInput>(
    key: string,
    options?: Partial<T>,
  ): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ...options,
    });

    await this.client.send(command);

    this.logger.log(`File deleted: ${key} from bucket ${this.bucketName}`);
  }
}
