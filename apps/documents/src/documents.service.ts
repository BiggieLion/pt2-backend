import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { REQUESTER_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly configSvc: ConfigService,
    @Inject(REQUESTER_SERVICE)
    private readonly requesterSvc: ClientProxy,
  ) {}

  private readonly region: string = this.configSvc.getOrThrow('aws.region');
  private readonly accessKey: string =
    this.configSvc.getOrThrow('aws.accessKey');
  private readonly secretKey: string =
    this.configSvc.getOrThrow('aws.secretKey');
  private readonly bucketName: string = this.configSvc.getOrThrow('s3.bucket');
  private readonly s3Client = new S3Client({
    region: this.region,
    credentials: {
      accessKeyId: this.accessKey,
      secretAccessKey: this.secretKey,
    },
  });

  private getObjectKey(userId: string, fileType: string): string {
    return `${userId}-${fileType}.pdf`;
  }

  private getGuaranteeKey(userId: string, fileType: string, creditId: string) {
    return `${userId}-${creditId}-${fileType}.pdf`;
  }

  async uploadFile(fileBuffer: Buffer, userId: string, fileType: string) {
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: this.getObjectKey(userId, fileType),
          Body: fileBuffer,
        }),
      );
      this.requesterSvc.emit('update-document', {
        sub: userId,
        docType: fileType,
        changeToYes: true,
      });
      return {
        message: `File ${fileType?.toUpperCase()} uploaded successfully`,
      };
    } catch (e) {
      throw new InternalServerErrorException(
        `Error uploading file ${fileType?.toUpperCase()}`,
      );
    }
  }

  async uploadGuaranteeFile(
    fileBuffer: Buffer,
    userId: string,
    fileType: string,
    creditId: string,
  ) {
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: this.getGuaranteeKey(userId, fileType, creditId),
          Body: fileBuffer,
        }),
      );
      this.requesterSvc.emit('update-document', {
        sub: userId,
        docType: fileType,
        changeToYes: true,
      });
      return {
        message: `File ${fileType?.toUpperCase()} uploaded successfully`,
      };
    } catch (e) {
      throw new InternalServerErrorException(
        `Error uploading file ${fileType?.toUpperCase()}`,
      );
    }
  }

  async getFile(userId: string, fileType: string) {
    try {
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.bucketName,
          Key: this.getObjectKey(userId, fileType),
        }),
      );

      const signedUrl: string = await getSignedUrl(
        this.s3Client,
        new GetObjectCommand({
          Bucket: this.bucketName,
          Key: this.getObjectKey(userId, fileType),
          ResponseContentType: 'application/pdf',
        }),
        { expiresIn: 3600 },
      );

      return {
        message: `File ${fileType?.toUpperCase()} found successfully`,
        data: { url: signedUrl },
      };
    } catch (e) {
      if (e?.name === 'NotFound') {
        this.requesterSvc.emit('update-document', {
          sub: userId,
          docType: fileType,
          changeToYes: false,
        });
        throw new NotFoundException(
          `File ${fileType?.toUpperCase()} not found`,
        );
      } else
        throw new InternalServerErrorException(
          `Error getting file ${fileType?.toUpperCase()}, ${e}`,
        );
    }
  }

  async getGuaranteeFile(userId: string, fileType: string, creditId: string) {
    console.log(
      'getGuaranteeFile',
      userId,
      fileType,
      creditId,
      this.getGuaranteeKey(userId, fileType, creditId),
    );
    try {
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.bucketName,
          Key: this.getGuaranteeKey(userId, fileType, creditId),
        }),
      );

      const signedUrl: string = await getSignedUrl(
        this.s3Client,
        new GetObjectCommand({
          Bucket: this.bucketName,
          Key: this.getGuaranteeKey(userId, fileType, creditId),
          ResponseContentType: 'application/pdf',
        }),
        { expiresIn: 3600 },
      );

      return {
        message: `File ${fileType?.toUpperCase()} found successfully`,
        data: { url: signedUrl },
      };
    } catch (e) {
      if (e?.name === 'NotFound') {
        this.requesterSvc.emit('update-document', {
          sub: userId,
          docType: fileType,
          changeToYes: false,
        });
        throw new NotFoundException(
          `File ${fileType?.toUpperCase()} not found`,
        );
      } else
        throw new InternalServerErrorException(
          `Error getting file ${fileType?.toUpperCase()}, ${e}`,
        );
    }
  }
}
