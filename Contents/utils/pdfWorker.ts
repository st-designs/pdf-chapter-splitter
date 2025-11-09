import * as pdfjsLib from 'pdfjs-dist';

/**
 * Sets up the pdf.js worker path for both web and Electron environments
 */
export function setupPdfWorker(): void {
  if (typeof window === 'undefined') return;

  // Check if we're in Electron
  const isElectron = window.navigator.userAgent.includes('Electron');
  
  if (isElectron) {
    // In Electron, use file:// protocol for the worker
    const path = window.location.pathname;
    const basePath = path.substring(0, path.lastIndexOf('/'));
    pdfjsLib.GlobalWorkerOptions.workerSrc = `${basePath}/pdf.worker.min.mjs`;
  } else {
    // In web browser, use relative path
    pdfjsLib.GlobalWorkerOptions.workerSrc = './pdf.worker.min.mjs';
  }
}

