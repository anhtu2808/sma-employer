import React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const PDF_WORKER_URL = "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

const PdfViewer = ({ resumeUrl, resumeName, candidateName }) => {
    if (!resumeUrl) return null;

    const fileName = resumeName || `${candidateName || 'resume'}_CV.pdf`;

    const renderError = () => (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-3">
            <span className="material-icons-round text-4xl text-gray-300 dark:text-neutral-600">picture_as_pdf</span>
            <p className="text-sm text-gray-500 dark:text-neutral-400">Unable to load PDF preview</p>
            <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
            >
                <span className="material-icons-round text-base">download</span>
                Download Resume
            </a>
        </div>
    );

    const renderLoader = () => (
        <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-end gap-1 px-3 py-1.5 bg-neutral-100/80 dark:bg-neutral-800/80 border-b border-neutral-200/60 dark:border-neutral-700/60">
                <span className="text-[11px] text-gray-400 dark:text-neutral-500 truncate mr-auto">{fileName}</span>
                <button
                    onClick={() => window.open(resumeUrl, '_blank')}
                    className="p-1 rounded text-gray-400 hover:text-gray-700 dark:hover:text-neutral-200 transition-colors"
                    title="Open in new tab"
                >
                    <span className="material-icons-round text-[16px]">open_in_new</span>
                </button>
                <button
                    onClick={() => {
                        const link = document.createElement('a');
                        link.href = resumeUrl;
                        link.download = fileName;
                        link.click();
                    }}
                    className="p-1 rounded text-gray-400 hover:text-gray-700 dark:hover:text-neutral-200 transition-colors"
                    title="Download"
                >
                    <span className="material-icons-round text-[16px]">download</span>
                </button>
            </div>

            {/* PDF Content */}
            <div className="flex-1 overflow-auto bg-neutral-50 dark:bg-neutral-950">
                <Worker workerUrl={PDF_WORKER_URL}>
                    <Viewer
                        fileUrl={resumeUrl}
                        renderLoader={renderLoader}
                        renderError={renderError}
                    />
                </Worker>
            </div>
        </div>
    );
};

export default PdfViewer;
