// lib/extractText.ts
import pdf2json from 'pdf2json';
import { Readable } from 'stream';

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new pdf2json();

    pdfParser.on('pdfParser_dataError', (err) => reject(err.parserError));
    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      const texts: string[] = [];

      pdfData.Pages.forEach((page: any) => {
        page.Texts.forEach((textObj: any) => {
          const line = textObj.R.map((r: any) => decodeURIComponent(r.T)).join('');
          texts.push(line);
        });
      });

      resolve(texts.join(' '));
    });

    pdfParser.parseBuffer(buffer);
  });
}
