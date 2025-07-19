import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { FileUploaderPort } from '../domain/file-uploader.port';

import { Readable } from 'stream';

@Injectable()
export class S3UploaderStrategy implements FileUploaderPort {
  private readonly logger = new Logger(S3UploaderStrategy.name);

  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(
    bucket: string,
    region: string,
    accessKeyId: string,
    secretAccessKey: string,
  ) {
    this.bucket = bucket;

    this.client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async upload<T extends PutObjectCommandInput>(
    key: string,
    body: Buffer | Uint8Array | Blob | string | Readable,
    contentType: string,
    options?: Partial<T>,
  ): Promise<string> {
    const region = await this.client.config.region();

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      ...options,
    });

    await this.client.send(command);

    this.logger.log(
      `File uploaded: ${key} to bucket ${this.bucket} in region ${region}`,
    );

    return `https://${this.bucket}.s3.${region}.amazonaws.com/${key}`;
  }

  async delete<T extends DeleteObjectCommandInput>(
    key: string,
    options?: Partial<T>,
  ): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ...options,
    });

    await this.client.send(command);

    this.logger.log(`File deleted: ${key} from bucket ${this.bucket}`);
  }
}
