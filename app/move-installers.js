import { existsSync, mkdirSync, renameSync, rmSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const releaseDir = join(rootDir, 'release');
const macReleaseDir = join(releaseDir, 'mac');
const macArmReleaseDir = join(releaseDir, 'mac-arm64');
const intelDir = join(releaseDir, 'Intel (x86_64)');
const appleSiliconDir = join(releaseDir, 'Apple Silicon (ARM64)');

const platform = process.argv[2] || 'mac';

// Read productName and version from package.json to build file names
const pkg = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf-8'));
const productName = pkg.build?.productName || pkg.name || 'App';
const version = pkg.version;

// Ensure platform-specific release directories exist
if (!existsSync(macReleaseDir)) {
  mkdirSync(macReleaseDir, { recursive: true });
}
if (!existsSync(macArmReleaseDir)) {
  mkdirSync(macArmReleaseDir, { recursive: true });
}
if (!existsSync(intelDir)) {
  mkdirSync(intelDir, { recursive: true });
}
if (!existsSync(appleSiliconDir)) {
  mkdirSync(appleSiliconDir, { recursive: true });
}

// Move Mac installers (per-arch)
if (platform === 'all' || platform === 'mac') {
  // With artifactName = "${productName} v${version}-${arch}.${ext}" and target dmg
  const intelDmg = join(releaseDir, `${productName} v${version}-x64.dmg`);
  if (existsSync(intelDmg)) {
    renameSync(intelDmg, join(intelDir, 'Intel (x86_64).dmg'));
    console.log('✓ Placed Intel DMG in', intelDir);
  }

  const arm64Dmg = join(releaseDir, `${productName} v${version}-arm64.dmg`);
  if (existsSync(arm64Dmg)) {
    renameSync(arm64Dmg, join(appleSiliconDir, 'Apple Silicon (ARM64).dmg'));
    console.log('✓ Placed Apple Silicon DMG in', appleSiliconDir);
  }

  // Optional: move DMG blockmaps if generated
  const intelBlockmap = join(releaseDir, `${productName} v${version}-x64.dmg.blockmap`);
  if (existsSync(intelBlockmap)) {
    try {
      renameSync(intelBlockmap, join(intelDir, 'Intel (x86_64).dmg.blockmap'));
      console.log('✓ Placed Intel DMG blockmap in', intelDir);
    } catch {}
  }
  const arm64Blockmap = join(releaseDir, `${productName} v${version}-arm64.dmg.blockmap`);
  if (existsSync(arm64Blockmap)) {
    try {
      renameSync(arm64Blockmap, join(appleSiliconDir, 'Apple Silicon (ARM64).dmg.blockmap'));
      console.log('✓ Placed Apple Silicon DMG blockmap in', appleSiliconDir);
    } catch {}
  }

  // Move .app bundles (built outputs) into respective folders if present
  const intelApp = join(macReleaseDir, `${productName}.app`);
  if (existsSync(intelApp)) {
    const intelDestApp = join(intelDir, `${productName}.app`);
    try { rmSync(intelDestApp, { recursive: true, force: true }); } catch {}
    renameSync(intelApp, intelDestApp);
    console.log('✓ Moved Intel .app into', intelDir);
  }
  const arm64App = join(macArmReleaseDir, `${productName}.app`);
  if (existsSync(arm64App)) {
    const armDestApp = join(appleSiliconDir, `${productName}.app`);
    try { rmSync(armDestApp, { recursive: true, force: true }); } catch {}
    renameSync(arm64App, armDestApp);
    console.log('✓ Moved Apple Silicon .app into', appleSiliconDir);
  }

  // Remove staging folders now that contents are moved
  try { rmSync(macReleaseDir, { recursive: true, force: true }); } catch {}
  try { rmSync(macArmReleaseDir, { recursive: true, force: true }); } catch {}
}

// Note: intentionally skipping Windows outputs for now per requirements

console.log('✓ Installers organized successfully');
