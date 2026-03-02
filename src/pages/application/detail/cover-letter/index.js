import React from 'react';

const CoverLetter = ({ coverLetter }) => {
    if (!coverLetter) return null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-5 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Cover Letter</h3>
            </div>
            <div className="p-5 md:p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-sm">
                    {coverLetter}
                </p>
            </div>
        </div>
    );
};

export default CoverLetter;
