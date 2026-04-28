'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    disabled?: boolean;
    bucketName?: string;
    orientation?: string;
}

export const ImageUpload = ({
    value,
    onChange,
    disabled,
    bucketName = 'uploads',
    orientation = 'LANDSCAPE'
}: ImageUploadProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadMode, setUploadMode] = useState<'FILE' | 'URL'>('FILE');
    const [urlInput, setUrlInput] = useState('');
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageError(false);
    }, [value]);

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }

        const file = e.target.files[0];

        try {
            setIsUploading(true);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('bucketName', bucketName);
            formData.append('folder', 'images');

            const response = await fetch('/api/uploads', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(result.error || 'Failed to upload image');
            }

            onChange(result.url);
            toast.success('Image uploaded successfully');
        } catch (error: any) {
            console.error('Error uploading image:', error);
            toast.error(error?.message || 'Failed to upload image');
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
        setImageError(false);
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
                {value && !imageError ? (
                    <div className={`relative w-full max-w-sm ${orientation === 'PORTRAIT' ? 'aspect-[3/4] max-w-[240px]' : 'aspect-video'} rounded-md overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900`}>
                        <div className="absolute top-2 right-2 z-10">
                            <Button
                                type="button"
                                onClick={onRemove}
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        {/* Use standard img tag for potentially external URLs to avoid Next.js domain config issues */}
                        <img
                            className="w-full h-full object-contain"
                            alt="Image"
                            src={value}
                            onError={() => {
                                setImageError(true);
                                toast.error('Failed to load image from URL. Make sure it is a direct image link.');
                            }}
                        />
                    </div>
                ) : (
                    <div className={`w-full max-w-sm ${orientation === 'PORTRAIT' ? 'aspect-[3/4] max-w-[240px]' : 'aspect-video'} rounded-md border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-500 transition-all`}>
                        {imageError ? (
                            <div className="flex flex-col items-center text-red-500">
                                <span className="material-symbols-outlined text-4xl mb-2">broken_image</span>
                                <span className="text-sm">Invalid Image URL</span>
                                <Button
                                    variant="link"
                                    className="text-red-500 mt-2 h-auto p-0"
                                    onClick={() => { setImageError(false); onRemove(); }}
                                >
                                    Try Another
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Upload className="h-10 w-10 mb-2" />
                                <span className="text-sm">No image selected</span>
                                <span className="text-xs text-muted-foreground mt-1">Recommended: {orientation === 'PORTRAIT' ? '3:4 Portrait' : '16:9 Landscape'}</span>
                            </>
                        )}
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
                        Image URL
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
                                    Upload Image
                                </>
                            )}
                            <input
                                type="file"
                                disabled={disabled || isUploading}
                                accept="image/*"
                                onChange={onUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                            />
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            Supported: JPG, PNG, GIF
                        </p>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            value={urlInput}
                            onChange={(e) => {
                                setUrlInput(e.target.value);
                                if (imageError) setImageError(false);
                            }}
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
                            Preview
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
