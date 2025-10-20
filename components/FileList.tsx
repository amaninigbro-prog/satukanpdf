
import React, { useState, useRef } from 'react';
import { PdfFile } from '../types';
import { GripVerticalIcon, FileIcon, XIcon } from './Icons';

interface FileListProps {
    files: PdfFile[];
    onReorder: (files: PdfFile[]) => void;
    onRemove: (fileId: string) => void;
}

const FileListItem: React.FC<{ 
    file: PdfFile; 
    index: number;
    onDragStart: (e: React.DragEvent<HTMLLIElement>, index: number) => void;
    onDragEnter: (e: React.DragEvent<HTMLLIElement>, index: number) => void;
    onDragEnd: (e: React.DragEvent<HTMLLIElement>) => void;
    onRemove: (fileId: string) => void;
    isDragging: boolean;
}> = ({ file, index, onDragStart, onDragEnter, onDragEnd, onRemove, isDragging }) => {
    
    return (
        <li
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragEnter={(e) => onDragEnter(e, index)}
            onDragEnd={onDragEnd}
            onDragOver={(e) => e.preventDefault()}
            className={`flex items-center p-3 bg-slate-800 border border-slate-700 rounded-lg shadow-sm transition-all duration-200 ${isDragging ? 'opacity-50 scale-95' : 'opacity-100'}`}
        >
            <div className="flex items-center flex-grow gap-3">
                <div className="text-slate-500 cursor-grab active:cursor-grabbing touch-none">
                    <GripVerticalIcon />
                </div>
                <div className="text-sky-400 w-6 h-6 flex-shrink-0">
                    <FileIcon />
                </div>
                <div className="flex-grow overflow-hidden">
                    <p className="text-sm font-medium text-slate-200 truncate" title={file.name}>{file.name}</p>
                    <p className="text-xs text-slate-400">{file.size}</p>
                </div>
            </div>
            <button 
                onClick={() => onRemove(file.id)} 
                className="ml-4 p-1 text-slate-500 hover:text-red-400 rounded-full hover:bg-slate-700 transition-colors"
                aria-label={`Remove ${file.name}`}
            >
                <XIcon />
            </button>
        </li>
    );
};

const FileList: React.FC<FileListProps> = ({ files, onReorder, onRemove }) => {
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLLIElement>, position: number) => {
        dragItem.current = position;
    };

    const handleDragEnter = (e: React.DragEvent<HTMLLIElement>, position: number) => {
        dragOverItem.current = position;
        const newFiles = [...files];
        if (dragItem.current === null) return;
        const draggedItemContent = newFiles[dragItem.current];
        newFiles.splice(dragItem.current, 1);
        newFiles.splice(dragOverItem.current, 0, draggedItemContent);
        dragItem.current = dragOverItem.current;
        dragOverItem.current = null;
        onReorder(newFiles);
    };

    const handleDragEnd = () => {
        dragItem.current = null;
    };
    
    return (
        <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-300 px-1">Your Files</h3>
            <ul className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
                 {files.map((file, index) => (
                    <FileListItem
                        key={file.id}
                        file={file}
                        index={index}
                        onDragStart={handleDragStart}
                        onDragEnter={handleDragEnter}
                        onDragEnd={handleDragEnd}
                        onRemove={onRemove}
                        isDragging={dragItem.current === index}
                    />
                ))}
            </ul>
        </div>
    );
};

export default FileList;
