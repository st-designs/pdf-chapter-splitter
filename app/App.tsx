
import React, { useState, useCallback } from 'react';
import { FileUploader } from './components/FileUploader';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Spinner } from './components/Spinner';
import { splitPdfByChapters } from './services/pdfSplitter';
import type { SplitPdfFile } from './types';
import { setupPdfWorker } from './utils/pdfWorker';

const App: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [splitFiles, setSplitFiles] = useState<SplitPdfFile[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
    const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState<boolean>(false);

    const [pdfjsLib, setPdfjsLib] = useState<any | null>(null);

    // Set up pdf.js worker on component mount
    React.useEffect(() => {
        (async () => {
            const pdfjs = await import('pdfjs-dist');
            setupPdfWorker(pdfjs);
            setPdfjsLib(pdfjs);
        })();
    }, []);

    const generateThumbnail = async (file: File) => {
        setIsGeneratingThumbnail(true);
        try {
            if (!pdfjsLib) {
                const pdfjs = await import('pdfjs-dist');
                setupPdfWorker(pdfjs);
                setPdfjsLib(pdfjs);
            }
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await (pdfjsLib || (await import('pdfjs-dist'))).getDocument(arrayBuffer).promise;
            const page = await pdf.getPage(1);

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (!context) {
                setIsGeneratingThumbnail(false);
                return;
            }

            const MAX_DIMENSION = 250;
            const viewport = page.getViewport({ scale: 1 });
            const scale = Math.min(MAX_DIMENSION / viewport.width, MAX_DIMENSION / viewport.height);
            const scaledViewport = page.getViewport({ scale });

            canvas.height = scaledViewport.height;
            canvas.width = scaledViewport.width;

            await page.render({
                canvasContext: context,
                viewport: scaledViewport,
            }).promise;
            
            setThumbnailUrl(canvas.toDataURL('image/jpeg', 0.8));
        } catch (e) {
            console.error('Error generating PDF thumbnail:', e);
            setThumbnailUrl(null);
        } finally {
            setIsGeneratingThumbnail(false);
        }
    };

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
        setSplitFiles([]);
        setError(null);
        setThumbnailUrl(null);
        generateThumbnail(file);
    };

    const handleSplitPdf = useCallback(async () => {
        if (!selectedFile) return;

        setIsProcessing(true);
        setSplitFiles([]);
        setError(null);

        try {
            const result = await splitPdfByChapters(selectedFile);
            if (result.length === 0) {
                setError("No chapters found in the PDF's table of contents. The PDF cannot be split.");
            } else {
                setSplitFiles(result);
            }
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during processing.";
            setError(`Error: ${errorMessage}`);
        } finally {
            setIsProcessing(false);
        }
    }, [selectedFile]);

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
            <div className="w-full max-w-3xl mx-auto bg-slate-800/50 rounded-2xl shadow-2xl backdrop-blur-lg border border-slate-700/50 overflow-hidden">
                <div className="p-8 border-b border-slate-700/50">
                    <div className="text-center">
                       <h1 className="text-3xl font-bold text-white tracking-tight">PDF Chapter Splitter</h1>
                       <p className="text-slate-400 mt-1">Upload a PDF to split it into separate files by chapter.</p>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div>
                        <FileUploader 
                            onFileSelect={handleFileSelect} 
                            disabled={isProcessing} 
                            thumbnailUrl={thumbnailUrl}
                            isGeneratingThumbnail={isGeneratingThumbnail}
                        />
                        {selectedFile && <p className="text-sm text-slate-400 mt-2 text-center">Selected: {selectedFile.name}</p>}
                    </div>
                    
                    <button
                        onClick={handleSplitPdf}
                        disabled={!selectedFile || isProcessing}
                        className="w-full flex items-center justify-center bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500"
                    >
                        {isProcessing ? <Spinner /> : 'Split PDF by Chapters'}
                    </button>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    {splitFiles.length > 0 && <ResultsDisplay files={splitFiles} originalFileName={selectedFile?.name || 'chapters.zip'} />}
                </div>
            </div>
             <footer className="text-center mt-8 text-slate-500 text-sm">
                <p>PDF processing is done entirely in your browser. Your files are never uploaded to a server.</p>
            </footer>
        </div>
    );
};

export default App;
