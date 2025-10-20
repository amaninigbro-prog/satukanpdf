
import React, { useState, useCallback, useRef } from 'react';
import { UploadCloudIcon } from './Icons';

interface FileUploadProps {
    onFilesChange: (files: FileList) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesChange }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFilesChange(e.dataTransfer.files);
        }
    }, [onFilesChange]);
    
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFilesChange(e.target.files);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const dragClasses = isDragging 
        ? 'border-sky-400 bg-slate-700/50 scale-105' 
        : 'border-slate-600 bg-slate-900/20 hover:border-slate-500';

    return (
        <div
            className={`relative flex flex-col items-center justify-center w-full p-10 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ${dragClasses}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
        >
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={handleFileSelect}
            />
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-16 h-16 text-slate-400">
                    <UploadCloudIcon />
                </div>
                <p className="text-lg text-slate-300">
                    <span className="font-semibold text-sky-400">Click to upload</span> or drag and drop
                </p>
            </div>
        </div>
    );
};

export default FileUpload;
