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
import { CurrentUser, JwtAuthGuard, Roles, UserDto } from '@app/common';
import { DocumentTypeEnum } from './documentType.enum';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsSvc: DocumentsService) {}

  private validateDocumentType(fileType: string): void {
    if (!Object.values(DocumentTypeEnum).includes(fileType as DocumentTypeEnum))
      throw new HttpException(
        { message: `${fileType.toUpperCase()} is not a valid document type` },
        400,
      );
  }

  @UseGuards(JwtAuthGuard)
  @Roles('requester')
  @UseInterceptors(FileInterceptor('file'))
  @Post('/:creditId/:fileType')
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
    @CurrentUser() user: UserDto,
    @Param('fileType') fileType: string,
    @Param('creditId') creditId: string,
  ) {
    this.validateDocumentType(fileType);
    return await this.documentsSvc.uploadFile(
      file.buffer,
      user?.id,
      fileType,
      creditId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Roles('requester', 'analyst', 'supervisor')
  @Get(':creditId/:fileType')
  async getDocument(
    @CurrentUser() user: UserDto,
    @Param('fileType') fileType: string,
    @Param('creditId') creditId: string,
  ) {
    this.validateDocumentType(fileType);
    return await this.documentsSvc.getFile(user?.id, fileType, creditId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('requester', 'analyst', 'supervisor')
  @Get('/:creditId/:userId/:fileType')
  async getDocumentByUserId(
    @Param('userId') userId: string,
    @Param('fileType') fileType: string,
    @Param('creditId') creditId: string,
  ) {
    this.validateDocumentType(fileType);
    return await this.documentsSvc.getFile(userId, fileType, creditId);
  }
}
