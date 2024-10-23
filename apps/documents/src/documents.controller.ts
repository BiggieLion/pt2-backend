import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
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

  @UseGuards(JwtAuthGuard)
  @Roles('requester')
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @CurrentUser() user,
  ) {
    return await this.documentsSvc.uploadFile(file.buffer, user?.id);
  }
}
