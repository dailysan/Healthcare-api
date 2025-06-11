import { Injectable } from '@nestjs/common';
import * as pdf from 'pdf-parse';
import * as pdf2json from 'pdf2json';

@Injectable()
export class PdfService {
  async parsePdf(buffer: Buffer): Promise<any> {
    return pdf(buffer);
  }

  async convertToJSON(buffer: Buffer): Promise<any> {
    const pdfParser = new pdf2json();
    return new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
      pdfParser.on("pdfParser_dataReady", pdfData => resolve(pdfData));
      pdfParser.parseBuffer(buffer);
    });
  }
}
