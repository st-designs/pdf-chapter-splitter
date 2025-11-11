const { execSync } = require("child_process");
const path = require("path");

const releaseDir = path.resolve(__dirname, "../release");
const candidates = [
  path.join(releaseDir, "mac/PDF Chapter Splitter.app"),
  path.join(releaseDir, "mac-arm64/PDF Chapter Splitter.app"),
];

for (const full of candidates) {
  try {
    console.log("Signing:", full);
    execSync(`codesign --force --deep --sign - "${full}"`, { stdio: "inherit" });
    console.log("✓ Signed:", full);
  } catch (e) {
    console.error("✗ Failed to sign:", full);
    console.error(e.message);
  }
}
