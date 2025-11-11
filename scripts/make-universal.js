#!/usr/bin/env node
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { makeUniversalApp } from '@electron/universal';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const releaseDir = join(rootDir, 'release');

const x64AppPath = join(releaseDir, 'mac', 'PDF Chapter Splitter.app');
const arm64AppPath = join(releaseDir, 'mac-arm64', 'PDF Chapter Splitter.app');
const outDir = join(releaseDir, 'mac-universal');
const outAppPath = join(outDir, 'PDF Chapter Splitter.app');

if (!existsSync(x64AppPath) || !existsSync(arm64AppPath)) {
  console.error('Missing app bundles to merge. Ensure both x64 and arm64 builds have been produced.');
  process.exit(1);
}

if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

(async () => {
  console.log('Merging x64 and arm64 apps into universal app...');
  await makeUniversalApp({
    x64AppPath,
    arm64AppPath,
    outAppPath,
    force: true,
    mergeASARs: true,
    x64ArchFiles: [
      '**/*darwin-x64.node',
      '**/*-x64.node',
      '**/*x64.node'
    ],
    arm64ArchFiles: [
      '**/*darwin-arm64.node',
      '**/*-arm64.node',
      '**/*arm64.node'
    ]
  });
  console.log('✓ Universal app created at', outAppPath);
})();
