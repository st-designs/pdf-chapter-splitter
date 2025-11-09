import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, existsSync, mkdirSync } from 'fs';

// Plugin to copy pdf.js worker to dist
const copyPdfWorker = () => {
  return {
    name: 'copy-pdf-worker',
    writeBundle() {
      const workerSrc = path.resolve(__dirname, 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs');
      const workerDest = path.resolve(__dirname, 'dist/pdf.worker.min.mjs');
      if (existsSync(workerSrc)) {
        const destDir = path.dirname(workerDest);
        if (!existsSync(destDir)) {
          mkdirSync(destDir, { recursive: true });
        }
        copyFileSync(workerSrc, workerDest);
      }
    }
  };
};

export default defineConfig({
  base: './',
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react(), copyPdfWorker()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});
