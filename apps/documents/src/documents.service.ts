import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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

  async uploadFile(fileBuffer: Buffer, userId: string, fileType: string) {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configSvc.getOrThrow('s3.bucket'),
        Key: `${userId}-${fileType}.pdf`,
        Body: fileBuffer,
      }),
    );

    return {
      message: `${fileType.toUpperCase()} uploaded successfully`,
    };
  }

  async getFile(userId: string, fileType: string) {
    try {
      const bucket: string = this.configSvc.getOrThrow('s3.bucket');
      const key: string = `${userId}-${fileType}.pdf`;
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: bucket,
          Key: key,
        }),
      );
      const signedUrl = await getSignedUrl(
        this.s3Client,
        new GetObjectCommand({
          Bucket: bucket,
          Key: key,
          ResponseContentType: 'application/pdf',
        }),
        { expiresIn: 3600 },
      );

      return {
        message: `${fileType.toUpperCase()} returned successfully`,
        data: { url: signedUrl },
      };
    } catch (error) {
      if (error?.name === 'NotFound') {
        throw new NotFoundException(`File ${fileType} does not exist`);
      } else {
        throw new InternalServerErrorException(
          `Error getting file ${fileType} from S3 bucket`,
        );
      }
    }
  }
}
