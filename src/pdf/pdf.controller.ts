import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('parse')
  @UseInterceptors(FileInterceptor('file'))
  async parsePdf(@UploadedFile() file: Express.Multer.File) {
    return this.pdfService.parsePdf(file.buffer);
  }

  @Post('convert')
  @UseInterceptors(FileInterceptor('file'))
  async convertToJSON(@UploadedFile() file: Express.Multer.File) {
    return this.pdfService.convertToJSON(file.buffer);
  }
}
