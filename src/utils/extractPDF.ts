import * as pdfjsLib from 'pdfjs-dist';

// Point worker to CDN to avoid bundler config issues
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

/**
 * Extracts all text content from a PDF File object.
 * Reads the file locally — nothing is uploaded or stored.
 */
export async function extractPDFText(file: File): Promise<string> {
  try {
    const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pageTexts: string[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((item: any) => item.str || '')
        .join(' ');
      pageTexts.push(pageText);
    }

    return pageTexts.join('\n').trim();
  } catch (error) {
    console.error('PDF extraction failed:', error);
    return '';
  }
}
