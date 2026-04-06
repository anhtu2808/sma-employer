import React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFilePdf } from '../../../../utils/icons';

const PDF_WORKER_URL = "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

const PdfViewer = ({ resumeUrl, resumeName, candidateName }) => {
    if (!resumeUrl) return null;

    const renderError = () => (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-3">
            <FontAwesomeIcon icon={faFilePdf} className="text-4xl text-gray-300 dark:text-neutral-600" />
            <p className="text-sm text-gray-500 dark:text-neutral-400">Unable to load PDF preview</p>
            <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
            >
                <FontAwesomeIcon icon={faDownload} className="text-base" />
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
        <div className="relative h-full bg-neutral-50 dark:bg-neutral-950 overflow-hidden">
            <div className="h-full overflow-auto scrollbar-thin pdf-viewer-fit">
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
