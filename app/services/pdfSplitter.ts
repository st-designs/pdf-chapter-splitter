import type { ChapterInfo, SplitPdfFile } from '../types';
import { setupPdfWorker } from '../utils/pdfWorker';

// Helper function to sanitize file names
const sanitizeFileName = (name: string): string => {
    // Allow square brackets for numbering
    return name.replace(/[^a-z0-9_ -\[\]]/gi, '_').replace(/\s+/g, '_') + '.pdf';
};

// Recursive helper to flatten the outline tree from pdf.js
const flattenOutline = async (outlineItems: any[], pdfDoc: any): Promise<{ title: string; pageNum: number }[]> => {
    const chapters: { title: string; pageNum: number }[] = [];
    for (const item of outlineItems) {
        if (item.dest && typeof item.dest === 'object') {
            try {
                // The destination is often an array where the first element is a reference object.
                const pageRef = item.dest[0];
                const pageIndex = await pdfDoc.getPageIndex(pageRef);
                chapters.push({ title: item.title, pageNum: pageIndex + 1 });
            } catch (e) {
                console.warn(`Could not resolve destination for outline item: ${item.title}`, e);
            }
        }
        // Optionally recurse for sub-chapters, but we'll stick to top-level for simplicity
        // if (item.items && item.items.length > 0) {
        //     chapters.push(...await flattenOutline(item.items, pdfDoc));
        // }
    }
    return chapters;
};


export const splitPdfByChapters = async (file: File): Promise<SplitPdfFile[]> => {
    // Lazy-load heavy libraries
    const pdfjsLib = await import('pdfjs-dist');
    setupPdfWorker(pdfjsLib);

    const arrayBuffer = await file.arrayBuffer();
    // Create a copy of the buffer for pdf-lib, as pdf.js will transfer and "detach" the original buffer when using its worker.
    const bufferForPdfLib = arrayBuffer.slice(0);

    // 1. Use pdf.js to get table of contents (outline) and page numbers
    const loadingTask = pdfjsLib.getDocument(arrayBuffer);
    const pdfDoc = await loadingTask.promise;
    const totalPages = pdfDoc.numPages;
    const outline = await pdfDoc.getOutline();
    
    if (!outline || outline.length === 0) {
        return [];
    }

    const flatChapters = await flattenOutline(outline, pdfDoc);
    if (flatChapters.length === 0) {
        return [];
    }

    // Sort chapters by page number just in case they are out of order
    flatChapters.sort((a, b) => a.pageNum - b.pageNum);

    const chapterInfos: ChapterInfo[] = flatChapters.map((chapter, index) => {
        const nextChapter = flatChapters[index + 1];
        return {
            title: chapter.title,
            startPage: chapter.pageNum,
            endPage: nextChapter ? nextChapter.pageNum - 1 : totalPages,
        };
    });
    
    // 2. Use pdf-lib to perform the splitting
    const { PDFDocument } = await import('pdf-lib');
    const originalPdf = await PDFDocument.load(bufferForPdfLib);
    const splitFiles: SplitPdfFile[] = [];

    for (const [index, chapter] of chapterInfos.entries()) {
        if (chapter.startPage > chapter.endPage) continue; // Skip if start page is after end page

        // Create a new PDF document for the chapter
        const newPdf = await PDFDocument.create();
        
        // Get the page indices (0-based) for the current chapter
        const pageIndices = Array.from(
            { length: chapter.endPage - chapter.startPage + 1 },
            (_, i) => chapter.startPage - 1 + i
        );

        if (pageIndices.length === 0) continue;

        // Copy the relevant pages from the original PDF to the new one
        const copiedPages = await newPdf.copyPages(originalPdf, pageIndices);
        copiedPages.forEach(page => newPdf.addPage(page));
        
        // Save the new PDF to a byte array
        const pdfBytes = await newPdf.save();
        
        const numberedTitle = `[${index + 1}] ${chapter.title}`;

        splitFiles.push({
            fileName: sanitizeFileName(numberedTitle),
            data: pdfBytes,
        });
    }

    return splitFiles;
};