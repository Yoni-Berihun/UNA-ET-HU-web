'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

interface PdfUploadProps {
    value: string;
    onChange: (url: string) => void;
    disabled?: boolean;
    bucketName?: string;
}

export const PdfUpload = ({
    value,
    onChange,
    disabled,
    bucketName = 'uploads',
}: PdfUploadProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadMode, setUploadMode] = useState<'FILE' | 'URL'>('FILE');
    const [urlInput, setUrlInput] = useState('');

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }

        const file = e.target.files[0];
        const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
        if (!isPdf) {
            toast.error('Please upload a PDF file');
            return;
        }

        try {
            setIsUploading(true);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('bucketName', bucketName);
            formData.append('folder', 'documents');

            const response = await fetch('/api/uploads', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(result.error || 'Failed to upload PDF');
            }

            onChange(result.url);
            toast.success('PDF uploaded successfully');
        } catch (error: any) {
            console.error('Error uploading pdf:', error);
            toast.error(error?.message || 'Failed to upload PDF');
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    const handleUrlSubmit = () => {
        if (!urlInput) return;
        onChange(urlInput);
    };

    const onRemove = () => {
        onChange('');
        setUrlInput('');
    };

    const handleUrlBlur = () => {
        if (urlInput && urlInput !== value) {
            onChange(urlInput);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleUrlSubmit();
        }
    };

    return (
        <div className="mb-4 flex flex-col gap-4">
            <div className="flex items-center gap-4">
                {value ? (
                    <div className="relative w-full max-w-sm p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 flex items-center gap-3">
                        <div className="absolute top-2 right-2 z-10">
                            <Button
                                type="button"
                                onClick={onRemove}
                                variant="destructive"
                                size="icon"
                                className="h-6 w-6"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                        <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                            <FileText className="h-8 w-8 text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">PDF Document</p>
                            <a
                                href={value}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline truncate block"
                            >
                                View PDF
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-sm p-8 rounded-md border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-500 transition-all">
                        <FileText className="h-10 w-10 mb-2" />
                        <span className="text-sm">No PDF selected</span>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-3">
                <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
                    <button
                        type="button"
                        onClick={() => setUploadMode('FILE')}
                        className={`text-sm font-medium px-3 py-1.5 border-b-2 transition-colors ${uploadMode === 'FILE' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                    >
                        Upload File
                    </button>
                    <button
                        type="button"
                        onClick={() => setUploadMode('URL')}
                        className={`text-sm font-medium px-3 py-1.5 border-b-2 transition-colors ${uploadMode === 'URL' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                    >
                        PDF URL
                    </button>
                </div>

                {uploadMode === 'FILE' ? (
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            disabled={disabled || isUploading}
                            variant="secondary"
                            className="relative"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload PDF
                                </>
                            )}
                            <input
                                type="file"
                                disabled={disabled || isUploading}
                                accept="application/pdf"
                                onChange={onUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                            />
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            Supported: PDF only
                        </p>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <input
                            type="url"
                            placeholder="https://example.com/document.pdf"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            onBlur={handleUrlBlur}
                            onKeyDown={handleKeyDown}
                            className="flex-1 h-10 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                        <Button
                            type="button"
                            disabled={disabled || !urlInput.trim()}
                            onClick={handleUrlSubmit}
                            variant="secondary"
                        >
                            Set URL
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
