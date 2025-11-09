import React, { useRef, useState, useCallback } from 'react';

interface FileUploaderProps {
    onFileSelect: (file: File) => void;
    disabled: boolean;
    thumbnailUrl?: string | null;
    isGeneratingThumbnail?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, disabled, thumbnailUrl, isGeneratingThumbnail }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    }, [onFileSelect]);


    return (
        <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleClick}
            className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 min-h-[220px]
            ${thumbnailUrl ? 'p-2' : 'p-8'}
            ${disabled ? 'border-slate-700 bg-slate-800 cursor-not-allowed' : 'border-slate-600 hover:border-indigo-500 hover:bg-slate-700/50'}
            ${isDragging ? 'border-indigo-500 bg-slate-700/50' : ''}`}
        >
            <input
                ref={inputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
                disabled={disabled}
            />
            {thumbnailUrl ? (
                <img src={thumbnailUrl} alt="PDF preview" className="h-full max-h-full w-auto object-contain rounded-md" />
            ) : isGeneratingThumbnail ? (
                 <div className="flex flex-col items-center text-slate-400">
                    <svg className="animate-spin h-10 w-10 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="font-semibold">Generating preview...</p>
                 </div>
            ) : (
                <div className="flex flex-col items-center text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="font-semibold">Click to upload or drag and drop</p>
                    <p className="text-sm">PDF file only</p>
                </div>
            )}
        </div>
    );
};