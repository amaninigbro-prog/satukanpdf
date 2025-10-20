import React, { useState, useCallback } from 'react';
import { PdfFile } from './types';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import ActionButton from './components/ActionButton';
import ProgressBar from './components/ProgressBar';
import { MergeIcon, DownloadIcon, AlertTriangleIcon } from './components/Icons';

// pdf-lib is loaded from CDN, so we need to tell TypeScript about the global variable.
declare global {
    interface Window {
        PDFLib: any;
    }
}

const App: React.FC = () => {
    const [files, setFiles] = useState<PdfFile[]>([]);
    const [isMerging, setIsMerging] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFilesChange = useCallback((selectedFiles: FileList) => {
        setError(null);
        setMergedPdfUrl(null);
        const newPdfFiles: PdfFile[] = Array.from(selectedFiles)
            .filter(file => file.type === 'application/pdf')
            .map(file => ({
                id: `${file.name}-${file.lastModified}-${file.size}`,
                file: file,
                name: file.name,
                size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
            }));
        
        setFiles(prevFiles => {
            const existingFileIds = new Set(prevFiles.map(f => f.id));
            const uniqueNewFiles = newPdfFiles.filter(f => !existingFileIds.has(f.id));
            return [...prevFiles, ...uniqueNewFiles];
        });
    }, []);
    
    const handleReorder = useCallback((reorderedFiles: PdfFile[]) => {
        setFiles(reorderedFiles);
    }, []);

    const handleRemove = useCallback((fileId: string) => {
        setFiles(prevFiles => prevFiles.filter(f => f.id !== fileId));
    }, []);

    const handleMerge = async () => {
        if (files.length < 2) {
            setError("Please upload at least two PDF files to merge.");
            return;
        }

        setIsMerging(true);
        setProgress(0);
        setError(null);
        setMergedPdfUrl(null);

        try {
            const { PDFDocument } = window.PDFLib;
            const mergedPdf = await PDFDocument.create();
            const totalFiles = files.length;

            for (let i = 0; i < totalFiles; i++) {
                const file = files[i].file;
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach(page => mergedPdf.addPage(page));
                
                // Simulate a smoother progress update
                await new Promise(resolve => setTimeout(resolve, 100));
                setProgress(((i + 1) / totalFiles) * 100);
            }

            const mergedPdfBytes = await mergedPdf.save();
            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setMergedPdfUrl(url);

        } catch (e) {
            console.error(e);
            setError("An error occurred while merging PDFs. Please check if the files are valid and not corrupted.");
        } finally {
            setIsMerging(false);
        }
    };

    const handleDownload = () => {
        if (!mergedPdfUrl) return;

        // Create a temporary anchor element to trigger the download
        const link = document.createElement('a');
        link.href = mergedPdfUrl;
        link.setAttribute('download', 'merged-document.pdf'); // Set the desired filename
        document.body.appendChild(link);
        link.click();

        // Clean up and remove the element
        document.body.removeChild(link);
    };

    const handleReset = () => {
        setFiles([]);
        setIsMerging(false);
        setProgress(0);
        if (mergedPdfUrl) {
            URL.revokeObjectURL(mergedPdfUrl);
        }
        setMergedPdfUrl(null);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 selection:bg-slate-500/30">
            <div className="w-full max-w-2xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-100 tracking-tight">
                        Elegant PDF Merger
                    </h1>
                </header>

                <main className="bg-slate-800/50 rounded-xl shadow-2xl shadow-slate-950/50 border border-slate-700 backdrop-blur-sm">
                    <div className="p-6 md:p-8">
                        {!mergedPdfUrl && files.length === 0 && <FileUpload onFilesChange={handleFilesChange} />}
                        
                        {files.length > 0 && (
                             <div className="space-y-6">
                                <FileList files={files} onReorder={handleReorder} onRemove={handleRemove} />
                                {isMerging ? (
                                    <ProgressBar progress={progress} />
                                ) : mergedPdfUrl ? (
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <ActionButton
                                            onClick={handleDownload}
                                            variant="primary"
                                            className="w-full"
                                        >
                                            <DownloadIcon />
                                            Download Merged PDF
                                        </ActionButton>
                                        <ActionButton onClick={handleReset} variant="secondary" className="w-full">
                                            Start Over
                                        </ActionButton>
                                    </div>
                                ) : (
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <ActionButton onClick={handleMerge} variant="primary" disabled={files.length < 2} className="w-full">
                                            <MergeIcon />
                                            Merge {files.length} Files
                                        </ActionButton>
                                        <ActionButton onClick={handleReset} variant="secondary" className="w-full">
                                            Clear All
                                        </ActionButton>
                                    </div>
                                )}
                            </div>
                        )}

                        {error && (
                            <div className="mt-4 flex items-center gap-3 text-red-400 bg-red-900/30 border border-red-500/30 p-3 rounded-lg">
                                <AlertTriangleIcon />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}
                    </div>
                </main>
                
                <footer className="text-center mt-8">
                    <p className="text-slate-500 text-sm">
                        Powered by Melfa.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default App;