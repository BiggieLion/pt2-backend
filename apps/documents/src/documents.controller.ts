import {
  Controller,
  FileTypeValidator,
  Get,
  HttpException,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser, JwtAuthGuard, Roles } from '@app/common';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsSvc: DocumentsService) {}

  validDocsTypes: string[] = ['ine', 'birth', 'domicile', 'tax'];

  @UseGuards(JwtAuthGuard)
  @Roles('requester')
  @UseInterceptors(FileInterceptor('file'))
  @Post(':fileType')
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1500000 }),
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @CurrentUser() user: any,
    @Param('fileType') fileType: string,
  ) {
    if (!this.validDocsTypes.includes(fileType))
      throw new HttpException(
        { message: `${fileType} is not a valid document type` },
        400,
      );
    return await this.documentsSvc.uploadFile(file.buffer, user?.id, fileType);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('requester', 'analyst', 'supervisor')
  @Get(':fileType')
  async getFileFromS3(
    @CurrentUser() user: any,
    @Param('fileType') fileType: string,
  ) {
    if (!this.validDocsTypes.includes(fileType))
      throw new HttpException(
        { message: `${fileType} is not a valid document type` },
        400,
      );
    return await this.documentsSvc.getFile(user?.id, fileType);
  }
}
