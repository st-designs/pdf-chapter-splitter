#!/usr/bin/env node
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdtempSync, rmSync } from 'fs';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const releaseDir = join(rootDir, 'release');
const appPath = join(releaseDir, 'mac-universal', 'PDF Chapter Splitter.app');
const dmgPath = join(releaseDir, 'PDF Chapter Splitter v1.0.0.dmg');

if (!existsSync(appPath)) {
  console.error('Universal app not found at', appPath);
  process.exit(1);
}

const tmpDir = mkdtempSync(join(os.tmpdir(), 'pdf-splitter-dmg-'));
try {
  console.log('Creating DMG from universal app...');
  // Create DMG using hdiutil
  // Layout: simple DMG with Applications symlink
  const volName = 'PDF Chapter Splitter';
  const dmgArgs = [
    'create',
    '-volname', `'${volName}'`,
    '-srcfolder', `'${appPath}'`,
    '-format', 'UDZO',
    '-ov',
    `'${dmgPath}'`
  ].join(' ');
  execSync(`hdiutil ${dmgArgs}`, { stdio: 'inherit', shell: '/bin/zsh' });
  console.log('✓ DMG created at', dmgPath);
} finally {
  try { rmSync(tmpDir, { recursive: true, force: true }); } catch {}
}
