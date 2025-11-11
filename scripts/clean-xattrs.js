const { execSync } = require("child_process");
const path = require("path");

const releaseDir = path.resolve(__dirname, "../release");
const targets = [
  path.join(releaseDir, "mac/*.app"),
  path.join(releaseDir, "mac-arm64/*.app"),
  path.join(releaseDir, "Intel (x86_64)/*.app"),
  path.join(releaseDir, "Apple Silicon (ARM64)/*.app"),
];

for (const appPath of targets) {
  try {
    console.log("Cleaning:", appPath);

    execSync(`find "${appPath}" -name "._*" -delete`);
    execSync(`xattr -rc "${appPath}"`);

    console.log("✓ Cleaned");
  } catch (e) {
    console.error("Error cleaning", appPath, e.message);
  }
}
