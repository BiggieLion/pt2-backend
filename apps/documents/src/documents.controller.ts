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
  @UseInterceptors(FileInterceptor('file'))
  @Post('ine')
  async uploadIne(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1500000 }),
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
      }),
    )
    ine: Express.Multer.File,
    @CurrentUser() user,
  ) {
    return await this.documentsSvc.uploadFile(ine.buffer, user?.id, 'ine');
  }

  @UseGuards(JwtAuthGuard)
  @Roles('requester')
  @UseInterceptors(FileInterceptor('file'))
  @Post('birth')
  async uploadBirthCertificate(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1500000 }),
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
      }),
    )
    birth: Express.Multer.File,
    @CurrentUser() user,
  ) {
    return await this.documentsSvc.uploadFile(birth.buffer, user?.id, 'birth');
  }

  @UseGuards(JwtAuthGuard)
  @Roles('requester')
  @UseInterceptors(FileInterceptor('file'))
  @Post('domicile')
  async uploadDomicileVoucher(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1500000 }),
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
      }),
    )
    domicile: Express.Multer.File,
    @CurrentUser() user,
  ) {
    return await this.documentsSvc.uploadFile(
      domicile.buffer,
      user?.id,
      'domicile',
    );
  }

  @UseGuards(JwtAuthGuard)
  @Roles('requester')
  @UseInterceptors(FileInterceptor('file'))
  @Post('tax')
  async uploadTaxCertificate(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1500000 }),
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
      }),
    )
    tax: Express.Multer.File,
    @CurrentUser() user,
  ) {
    return await this.documentsSvc.uploadFile(tax.buffer, user?.id, 'tax');
  }
}
