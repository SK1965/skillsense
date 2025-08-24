// lib/extractText.ts
import pdf2json from 'pdf2json';

// Define minimal types for pdf2json result structure
interface TextRun {
  T: string; // Encoded text
}

interface TextObject {
  R: TextRun[];
}

interface Page {
  Texts: TextObject[];
}

interface PDFData {
  Pages: Page[];
}

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new pdf2json();

    pdfParser.on('pdfParser_dataError', (err: { parserError: Error }) => {
      reject(err.parserError);
    });

    pdfParser.on('pdfParser_dataReady', (pdfData: PDFData) => {
      const texts: string[] = [];

      pdfData.Pages.forEach((page) => {
        page.Texts.forEach((textObj) => {
          const line = textObj.R.map((r) => decodeURIComponent(r.T)).join('');
          texts.push(line);
        });
      });

      resolve(texts.join(' '));
    });

    pdfParser.parseBuffer(buffer);
  });
}
