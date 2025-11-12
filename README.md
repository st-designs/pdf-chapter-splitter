# PDF Chapter Splitter

A simple, standalone desktop application that automatically splits PDF files into separate chapter files based on the document's table of contents. Process your PDFs entirely locally with no server uploads required.

## Features

- ✨ **Automatic Chapter Detection** - Uses the PDF's built-in table of contents
- 🔒 **100% Local Processing** - All PDF processing happens on your device
- 📦 **Batch Download** - Download individual chapters or all chapters as a ZIP file
- 🚀 **Fast & Efficient** - Modern, lightweight desktop application
- 💻 **Works Offline** - No internet connection required after installation

## How It Works

1. **Upload a PDF** - Select a PDF file with a table of contents
2. **Automatic Detection** - The app reads the PDF's chapter structure
3. **Split & Download** - Get separate PDF files for each chapter or download all as a ZIP

## System Requirements

- **Mac**: macOS 10.12 or later (supports both Intel and Apple Silicon)
- **Windows**: Windows 7 or later (32-bit and 64-bit)

## Privacy & Security

- ✅ All processing happens locally on your computer
- ✅ No data is uploaded to any server
- ✅ No internet connection required
- ✅ No API keys or external services needed

## How to Install

If macOS says the app is "damaged" or "can’t be opened," follow these steps:

1. Disable Gatekeeper (temporarily)

- Open Terminal (Applications → Utilities)
- Run this command (you will be asked for your password):

```bash
sudo spctl --master-disable
```

- Open System Settings → Privacy & Security
- Scroll down and enable "Allow apps downloaded from: Anywhere."

2. Remove Quarantine (important)

If the app still doesn’t open, remove the quarantine flag:

```bash
xattr -dr com.apple.quarantine "/Applications/PDF Chapter Splitter.app"
```

3. Open the App

Now open it normally from your Applications folder.

4. (Optional) Re-enable Gatekeeper

Once the app runs successfully, you can turn Gatekeeper back on for safety:

```bash
sudo spctl --master-enable
```

---
