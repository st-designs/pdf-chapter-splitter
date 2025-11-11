import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outDir = join(__dirname, 'dist-electron');

if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

build({
  entryPoints: [join(__dirname, 'electron/main.ts')],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  outfile: join(outDir, 'main.js'),
  external: ['electron'],
  sourcemap: false,
  minify: true,
}).catch(() => process.exit(1));

