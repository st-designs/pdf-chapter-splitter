import { existsSync, mkdirSync, renameSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const releaseDir = join(rootDir, 'release');
const macIntelReleaseDir = join(releaseDir, 'mac');
const macArm64ReleaseDir = join(releaseDir, 'mac-arm64');
const winReleaseDir = join(releaseDir, 'win');

const platform = process.argv[2] || 'all';

// Ensure platform-specific release directories exist
if (!existsSync(macIntelReleaseDir)) {
  mkdirSync(macIntelReleaseDir, { recursive: true });
}
if (!existsSync(macArm64ReleaseDir)) {
  mkdirSync(macArm64ReleaseDir, { recursive: true });
}
if (!existsSync(winReleaseDir)) {
  mkdirSync(winReleaseDir, { recursive: true });
}

// Move Mac installers
if (platform === 'all' || platform === 'mac') {
  const arm64Dmg = join(releaseDir, 'PDF Chapter Splitter-1.0.0-arm64.dmg');
  const intelDmg = join(releaseDir, 'PDF Chapter Splitter-1.0.0.dmg');
  const arm64Blockmap = join(releaseDir, 'PDF Chapter Splitter-1.0.0-arm64.dmg.blockmap');
  const intelBlockmap = join(releaseDir, 'PDF Chapter Splitter-1.0.0.dmg.blockmap');

  if (existsSync(arm64Dmg)) {
    renameSync(arm64Dmg, join(macArm64ReleaseDir, 'PDF Chapter Splitter (Apple Silicon).dmg'));
    console.log('✓ Moved Apple Silicon DMG to release/mac-arm64');
  }
  if (existsSync(intelDmg)) {
    renameSync(intelDmg, join(macIntelReleaseDir, 'PDF Chapter Splitter (Intel).dmg'));
    console.log('✓ Moved Intel DMG to release/mac');
  }
  if (existsSync(arm64Blockmap)) {
    try {
      renameSync(arm64Blockmap, join(macArm64ReleaseDir, 'PDF Chapter Splitter (Apple Silicon).dmg.blockmap'));
    } catch (e) {
      // File might already be moved
    }
  }
  if (existsSync(intelBlockmap)) {
    try {
      renameSync(intelBlockmap, join(macIntelReleaseDir, 'PDF Chapter Splitter (Intel).dmg.blockmap'));
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
    renameSync(winExe, join(winReleaseDir, 'PDF Chapter Splitter Setup.exe'));
    console.log('✓ Moved Windows installer to release/win');
  }
  if (existsSync(winBlockmap)) {
    try {
      renameSync(winBlockmap, join(winReleaseDir, 'PDF Chapter Splitter Setup.exe.blockmap'));
    } catch (e) {
      // File might already be moved
    }
  }
}

console.log('✓ Installers organized successfully');
