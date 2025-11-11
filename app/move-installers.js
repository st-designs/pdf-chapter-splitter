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
  // With dmg.artifactName = "PDF Chapter Splitter v${version}-${arch}.dmg"
  // Source DMGs may already be in release/mac with friendly names from previous step
  const intelDmgSrcs = [
    join(releaseDir, 'PDF Chapter Splitter v1.0.0-x64.dmg'),
    join(macReleaseDir, 'PDF Chapter Splitter v1.0.0 (Intel).dmg'),
  ];
  const arm64DmgSrcs = [
    join(releaseDir, 'PDF Chapter Splitter v1.0.0-arm64.dmg'),
    join(macReleaseDir, 'PDF Chapter Splitter v1.0.0 (Apple Silicon).dmg'),
  ];
  const intelBlockmapSrcs = [
    join(releaseDir, 'PDF Chapter Splitter v1.0.0-x64.dmg.blockmap'),
    join(macReleaseDir, 'PDF Chapter Splitter v1.0.0 (Intel).dmg.blockmap'),
  ];
  const arm64BlockmapSrcs = [
    join(releaseDir, 'PDF Chapter Splitter v1.0.0-arm64.dmg.blockmap'),
    join(macReleaseDir, 'PDF Chapter Splitter v1.0.0 (Apple Silicon).dmg.blockmap'),
  ];

  // Move Intel DMG + blockmap into Intel folder, renaming to common name
  const intelDmgSrc = intelDmgSrcs.find(p => existsSync(p));
  if (intelDmgSrc) {
    renameSync(intelDmgSrc, join(intelDir, 'Intel (x86_64).dmg'));
    console.log('✓ Placed Intel DMG in', intelDir);
  }
  const intelBlockmapSrc = intelBlockmapSrcs.find(p => existsSync(p));
  if (intelBlockmapSrc) {
    renameSync(intelBlockmapSrc, join(intelDir, 'Intel (x86_64).dmg.blockmap'));
  }

  // Move Apple Silicon DMG + blockmap into Apple Silicon folder, renaming to common name
  const arm64DmgSrc = arm64DmgSrcs.find(p => existsSync(p));
  if (arm64DmgSrc) {
    renameSync(arm64DmgSrc, join(appleSiliconDir, 'Apple Silicon (ARM64).dmg'));
    console.log('✓ Placed Apple Silicon DMG in', appleSiliconDir);
  }
  const arm64BlockmapSrc = arm64BlockmapSrcs.find(p => existsSync(p));
  if (arm64BlockmapSrc) {
    renameSync(arm64BlockmapSrc, join(appleSiliconDir, 'Apple Silicon (ARM64).dmg.blockmap'));
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
