# PDF Chapter Splitter

A standalone desktop application for splitting PDF files by chapters. Built with React, Electron, and Vite.

## Features

- Split PDF files into separate chapter files based on table of contents
- Process PDFs entirely locally - no server uploads required
- Download individual chapters or all chapters as a ZIP file
- Modern, responsive UI built with Tailwind CSS

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the web app in development mode:
   ```bash
   npm run dev
   ```
   This will start the Vite dev server at http://localhost:3000

3. Run the Electron app in development mode:
   ```bash
   npm run electron:dev
   ```
   This will build the Electron main process, start the Vite dev server, and launch the Electron window.

## Building for Production

### Build the Web App

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Build Desktop Application

#### For Mac (DMG)

```bash
npm run electron:pack:mac
```

This will:
- Build the React app
- Build the Electron main process
- Package the app as a DMG file for Mac (supports both Intel and Apple Silicon)

The DMG file will be created in the `release/` directory.

#### For Windows (Installer)

```bash
npm run electron:pack:win
```

This will create an NSIS installer in the `release/` directory.

#### For Current Platform

```bash
npm run electron:pack
```

This packages the app for your current platform without creating an installer.

### Build Electron App with Installer

```bash
npm run electron:build
```

This builds and packages the app for the current platform.

## Project Structure

```
├── electron/           # Electron main process
│   └── main.ts        # Main Electron entry point
├── components/         # React components
├── services/          # Business logic (PDF processing)
├── Icons/             # Application icons
├── dist/              # Built web app (generated)
├── dist-electron/     # Built Electron main process (generated)
└── release/           # Packaged applications (generated)
```

## Technical Details

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Desktop Framework**: Electron
- **PDF Processing**: pdf.js and pdf-lib
- **Styling**: Tailwind CSS
- **Packaging**: electron-builder

## Notes

- All PDF processing is done entirely in the browser/Electron renderer process
- No API keys or external services are required
- The app works completely offline after installation
- Code signing is disabled for both Mac and Windows builds
