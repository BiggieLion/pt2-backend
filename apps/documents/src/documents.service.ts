import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DocumentsService {
  constructor(private readonly configSvc: ConfigService) {}

  private readonly s3Client = new S3Client({
    region: this.configSvc.getOrThrow('aws.region'),
    credentials: {
      accessKeyId: this.configSvc.getOrThrow('aws.accessKey'),
      secretAccessKey: this.configSvc.getOrThrow('aws.secretKey'),
    },
  });

  async uploadFile(fileBuffer: Buffer, userId: string) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configSvc.getOrThrow('s3.bucket'),
        Key: `${userId}-ine.pdf`,
        Body: fileBuffer,
      }),
    );

    return {
      message: 'INE uploaded successfully',
    };
  }
}
