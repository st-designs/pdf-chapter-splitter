import { existsSync, mkdirSync, renameSync, readdirSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const releaseDir = join(rootDir, 'release');
const macReleaseDir = join(releaseDir, 'mac');
const macArmReleaseDir = join(releaseDir, 'mac-arm64');
const winReleaseDir = join(releaseDir, 'windows');
const intelDir = join(releaseDir, 'Intel (x86_64)');
const appleSiliconDir = join(releaseDir, 'Apple Silicon (ARM64)');

const platform = process.argv[2] || 'all';

// Ensure platform-specific release directories exist
if (!existsSync(macReleaseDir)) {
  mkdirSync(macReleaseDir, { recursive: true });
}
if (!existsSync(macArmReleaseDir)) {
  mkdirSync(macArmReleaseDir, { recursive: true });
}
if (!existsSync(winReleaseDir)) {
  mkdirSync(winReleaseDir, { recursive: true });
}
if (!existsSync(intelDir)) {
  mkdirSync(intelDir, { recursive: true });
}
if (!existsSync(appleSiliconDir)) {
  mkdirSync(appleSiliconDir, { recursive: true });
}

// Move Mac installers (per-arch)
if (platform === 'all' || platform === 'mac') {
  // With artifactName = "PDF Chapter Splitter v${version}-${arch}.zip"
  // Move Intel ZIP into Intel folder, renaming to folder name
  const intelZip = join(releaseDir, 'PDF Chapter Splitter v1.0.0-x64.zip');
  if (existsSync(intelZip)) {
    renameSync(intelZip, join(intelDir, 'Intel (x86_64).zip'));
    console.log('✓ Placed Intel ZIP in', intelDir);
  }

  // Move Apple Silicon ZIP into Apple Silicon folder, renaming to folder name
  const arm64Zip = join(releaseDir, 'PDF Chapter Splitter v1.0.0-arm64.zip');
  if (existsSync(arm64Zip)) {
    renameSync(arm64Zip, join(appleSiliconDir, 'Apple Silicon (ARM64).zip'));
    console.log('✓ Placed Apple Silicon ZIP in', appleSiliconDir);
  }

  // Move ZIP blockmaps (if generated) into respective folders
  const intelZipBlockmap = join(releaseDir, 'PDF Chapter Splitter v1.0.0-x64.zip.blockmap');
  if (existsSync(intelZipBlockmap)) {
    try {
      renameSync(intelZipBlockmap, join(intelDir, 'Intel (x86_64).zip.blockmap'));
      console.log('✓ Placed Intel ZIP blockmap in', intelDir);
    } catch {}
  }
  const arm64ZipBlockmap = join(releaseDir, 'PDF Chapter Splitter v1.0.0-arm64.zip.blockmap');
  if (existsSync(arm64ZipBlockmap)) {
    try {
      renameSync(arm64ZipBlockmap, join(appleSiliconDir, 'Apple Silicon (ARM64).zip.blockmap'));
      console.log('✓ Placed Apple Silicon ZIP blockmap in', appleSiliconDir);
    } catch {}
  }

  // Move .app bundles (built outputs) into respective folders
  const intelApp = join(macReleaseDir, 'PDF Chapter Splitter.app');
  if (existsSync(intelApp)) {
    const intelDestApp = join(intelDir, 'PDF Chapter Splitter.app');
    try { rmSync(intelDestApp, { recursive: true, force: true }); } catch {}
    renameSync(intelApp, intelDestApp);
    console.log('✓ Moved Intel .app into', intelDir);
  }
  const arm64App = join(macArmReleaseDir, 'PDF Chapter Splitter.app');
  if (existsSync(arm64App)) {
    const armDestApp = join(appleSiliconDir, 'PDF Chapter Splitter.app');
    try { rmSync(armDestApp, { recursive: true, force: true }); } catch {}
    renameSync(arm64App, armDestApp);
    console.log('✓ Moved Apple Silicon .app into', appleSiliconDir);
  }

  // Remove staging folders now that contents are moved
  try { rmSync(macReleaseDir, { recursive: true, force: true }); } catch {}
  try { rmSync(macArmReleaseDir, { recursive: true, force: true }); } catch {}
}

// Move Windows installer
if (platform === 'all' || platform === 'win') {
  const winExe = join(releaseDir, 'PDF Chapter Splitter v1.0.0.exe');
  const winBlockmap = join(releaseDir, 'PDF Chapter Splitter v1.0.0.exe.blockmap');

  if (existsSync(winExe)) {
    renameSync(winExe, join(winReleaseDir, 'PDF Chapter Splitter v1.0.0.exe'));
    console.log('✓ Moved Windows installer to release/win');
  }
  if (existsSync(winBlockmap)) {
    try {
      renameSync(winBlockmap, join(winReleaseDir, 'PDF Chapter Splitter v1.0.0.exe.blockmap'));
    } catch (e) {
      // File might already be moved
    }
  }
}

console.log('✓ Installers organized successfully');
