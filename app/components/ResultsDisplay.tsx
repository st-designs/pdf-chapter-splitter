import React, { useState } from 'react';
import type { SplitPdfFile } from '../types';
import JSZip from 'jszip';

interface ResultsDisplayProps {
    files: SplitPdfFile[];
    originalFileName: string;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ files, originalFileName }) => {
    const [isZipping, setIsZipping] = useState(false);

    const handleDownload = (file: SplitPdfFile) => {
        const blob = new Blob([file.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDownloadAll = async () => {
        if (files.length === 0 || isZipping) return;
        setIsZipping(true);

        try {
            const zip = new JSZip();
            const folder = zip.folder("Segmented_PDF");

            if(folder) {
                files.forEach(file => {
                    folder.file(file.fileName, file.data);
                });
            }

            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const zipFileName = `${originalFileName.replace(/\.pdf$/i, '')}_chapters.zip`;
            
            const url = URL.createObjectURL(zipBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = zipFileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Error creating ZIP file:", error);
            // Optionally, show an error message to the user
        } finally {
            setIsZipping(false);
        }
    };

    return (
        <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Split Chapters</h2>
                <button
                    onClick={handleDownloadAll}
                    disabled={isZipping || files.length === 0}
                    className="flex items-center justify-center bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 text-sm"
                >
                    {isZipping ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Zipping...
                        </>
                    ) : (
                        'Download All as ZIP'
                    )}
                </button>
            </div>
            <div className="bg-slate-900/50 rounded-lg border border-slate-700/50 max-h-80 overflow-y-auto">
                <ul className="divide-y divide-slate-700/50">
                    {files.map((file, index) => (
                        <li key={index} className="flex items-center justify-between p-4">
                            <div className="flex items-center space-x-3 min-w-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-slate-300 flex-1 truncate" title={file.fileName}>{file.fileName}</span>
                            </div>
                            <button
                                onClick={() => handleDownload(file)}
                                className="flex-shrink-0 ml-4 p-2 rounded-full bg-slate-700 hover:bg-indigo-600 transition-colors duration-200"
                                title="Download chapter"
                                aria-label={`Download ${file.fileName}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};