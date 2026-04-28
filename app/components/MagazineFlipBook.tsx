'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

// CSS for react-pdf
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

export default function MagazineViewer() {
    const [numPages, setNumPages] = useState<number>(0);
    const [scale, setScale] = useState(1.0);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3.0));
    const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

    return (
        <div className="flex flex-col items-center w-full">
            {/* Zoom Controls */}
            <div className="flex items-center gap-4 mb-6 sticky top-20 z-10 bg-[#f5f5f8] dark:bg-[#0f0f23] p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
                <button
                    onClick={handleZoomOut}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                    title="Zoom Out"
                >
                    <span className="material-symbols-outlined">remove_circle_outline</span>
                </button>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 w-12 text-center">
                    {Math.round(scale * 100)}%
                </span>
                <button
                    onClick={handleZoomIn}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                    title="Zoom In"
                >
                    <span className="material-symbols-outlined">add_circle_outline</span>
                </button>
            </div>

            <div className="flex flex-col items-center w-full gap-8 pb-20">
                <Document
                    file="/november-issue-2025.pdf"
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                        <div className="flex flex-col items-center gap-4 py-20">
                            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-[#5e5f8d] dark:text-gray-400">Loading Magazine...</p>
                        </div>
                    }
                    error={
                        <div className="text-center p-8 text-red-500">
                            <p>Failed to load PDF.</p>
                        </div>
                    }
                    className="flex flex-col gap-6"
                >
                    {Array.from(new Array(numPages), (el, index) => (
                        <div key={`page_${index + 1}`} className="shadow-2xl">
                            <Page
                                pageNumber={index + 1}
                                scale={scale}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                className="bg-white"
                                loading={
                                    <div className="w-[600px] h-[800px] bg-white flex items-center justify-center text-gray-400 animate-pulse">
                                        Loading Page {index + 1}...
                                    </div>
                                }
                            />
                        </div>
                    ))}
                </Document>
            </div>
        </div>
    );
}
