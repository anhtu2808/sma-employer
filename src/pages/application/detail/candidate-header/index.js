import React from 'react';
import { Tooltip } from 'antd';

const CandidateHeader = ({ app, onOpenBlock }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-100 dark:border-neutral-800">
            <div className="min-w-0">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                    {app.candidateName}
                </h1>
                <p className="text-sm text-orange-500 font-medium">{app.jobTitle}</p>
            </div>
            <Tooltip title="Blacklist this candidate">
                <button
                    type="button"
                    onClick={onOpenBlock}
                    className="flex items-center justify-center w-9 h-9 rounded-full border border-red-100 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 dark:border-red-900/50 dark:bg-red-900/20"
                >
                    <span className="material-symbols-outlined text-[18px]">block</span>
                </button>
            </Tooltip>
        </div>
    );
};

export default CandidateHeader;
