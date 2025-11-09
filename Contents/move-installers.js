import { existsSync, mkdirSync, renameSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const releaseDir = join(rootDir, 'release');
const macInstallerDir = join(rootDir, 'MacOS Installers');
const winInstallerDir = join(rootDir, 'Windows Installer');

const platform = process.argv[2] || 'all';

// Ensure directories exist
if (!existsSync(macInstallerDir)) {
  mkdirSync(macInstallerDir, { recursive: true });
}
if (!existsSync(winInstallerDir)) {
  mkdirSync(winInstallerDir, { recursive: true });
}

// Move Mac installers
if (platform === 'all' || platform === 'mac') {
  const arm64Dmg = join(releaseDir, 'PDF Chapter Splitter-1.0.0-arm64.dmg');
  const intelDmg = join(releaseDir, 'PDF Chapter Splitter-1.0.0.dmg');
  const arm64Blockmap = join(releaseDir, 'PDF Chapter Splitter-1.0.0-arm64.dmg.blockmap');
  const intelBlockmap = join(releaseDir, 'PDF Chapter Splitter-1.0.0.dmg.blockmap');

  if (existsSync(arm64Dmg)) {
    renameSync(arm64Dmg, join(macInstallerDir, 'PDF Chapter Splitter (Apple Silicon).dmg'));
    console.log('✓ Moved Apple Silicon DMG');
  }
  if (existsSync(intelDmg)) {
    renameSync(intelDmg, join(macInstallerDir, 'PDF Chapter Splitter (Intel).dmg'));
    console.log('✓ Moved Intel DMG');
  }
  if (existsSync(arm64Blockmap)) {
    try {
      renameSync(arm64Blockmap, join(macInstallerDir, 'PDF Chapter Splitter (Apple Silicon).dmg.blockmap'));
    } catch (e) {
      // File might already be moved
    }
  }
  if (existsSync(intelBlockmap)) {
    try {
      renameSync(intelBlockmap, join(macInstallerDir, 'PDF Chapter Splitter (Intel).dmg.blockmap'));
    } catch (e) {
      // File might already be moved
    }
  }
}

// Move Windows installer
if (platform === 'all' || platform === 'win') {
  const winExe = join(releaseDir, 'PDF Chapter Splitter Setup 1.0.0.exe');
  const winBlockmap = join(releaseDir, 'PDF Chapter Splitter Setup 1.0.0.exe.blockmap');

  if (existsSync(winExe)) {
    renameSync(winExe, join(winInstallerDir, 'PDF Chapter Splitter Setup.exe'));
    console.log('✓ Moved Windows installer');
  }
  if (existsSync(winBlockmap)) {
    try {
      renameSync(winBlockmap, join(winInstallerDir, 'PDF Chapter Splitter Setup.exe.blockmap'));
    } catch (e) {
      // File might already be moved
    }
  }
}

console.log('✓ Installers organized successfully');

