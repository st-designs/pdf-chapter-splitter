import workerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';

/**
 * Sets up the pdf.js worker path for both web and Electron environments
 */
export function setupPdfWorker(pdfjsLib: any): void {
  if (typeof window === 'undefined' || !pdfjsLib) return;
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl as unknown as string;
}

