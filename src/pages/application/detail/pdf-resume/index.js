import React from 'react';
import Button from '@/components/Button';

const PdfResume = ({ resumeUrl, resumeName, candidateName }) => {
    if (!resumeUrl) return null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-5 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50/80 dark:bg-gray-800/80">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Resume</h3>
                <div className="flex items-center gap-2">
                    <Button
                        mode="ghost"
                        size="sm"
                        btnIcon
                        onClick={() => window.open(resumeUrl, '_blank')}
                    >
                        <span className="material-icons-round text-lg">open_in_new</span>
                    </Button>
                    <Button
                        mode="ghost"
                        size="sm"
                        btnIcon
                        onClick={() => {
                            const link = document.createElement('a');
                            link.href = resumeUrl;
                            link.download = resumeName || `${candidateName || 'resume'}_CV.pdf`;
                            link.click();
                        }}
                    >
                        <span className="material-icons-round text-lg">download</span>
                    </Button>
                </div>
            </div>
            <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(resumeUrl)}&embedded=true`}
                title="Resume Preview"
                className="w-full border-0"
                style={{ minHeight: 900 }}
            />
        </div>
    );
};

export default PdfResume;
