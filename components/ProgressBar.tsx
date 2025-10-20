
import React from 'react';

interface ProgressBarProps {
    progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
    const displayProgress = Math.round(progress);
    return (
        <div className="w-full space-y-2">
            <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-slate-300">Merging in progress...</p>
                <p className="text-sm font-bold text-sky-400">{displayProgress}%</p>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div
                    className="bg-sky-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressBar;
