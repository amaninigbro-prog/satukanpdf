
import React from 'react';

interface ActionButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
    className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
    onClick,
    children,
    disabled = false,
    variant = 'primary',
    className = ''
}) => {
    const baseClasses = "flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
        primary: 'bg-sky-500 text-white hover:bg-sky-600 focus:ring-sky-500 disabled:bg-sky-500/50',
        secondary: 'bg-slate-700 text-slate-200 hover:bg-slate-600 focus:ring-slate-500 disabled:bg-slate-700/50'
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

export default ActionButton;
