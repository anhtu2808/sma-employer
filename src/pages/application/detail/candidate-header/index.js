import React from 'react';
import { Tooltip, Tag } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faClockRotateLeft } from '../../../../utils/icons';
import { FolderPlus } from 'lucide-react';

const CandidateHeader = ({ app, onOpenBlock, onOpenAddToPool, compact = false }) => {
    if (compact) {
        return (
            <div className="flex items-center gap-2">
                {app.attempt > 1 && (
                    <Tooltip title={`This candidate has applied ${app.attempt} times`}>
                        <Tag color="blue" className="rounded-full px-1.5 py-0 border-none bg-blue-50 text-blue-600 font-bold text-[9px] uppercase flex items-center gap-0.5 m-0">
                            <FontAwesomeIcon icon={faClockRotateLeft} className="text-[9px]" />
                            {app.attempt}th
                        </Tag>
                    </Tooltip>
                )}
                <Tooltip title="Add to Talent Pool">
                    <button
                        type="button"
                        onClick={onOpenAddToPool}
                        className="flex items-center justify-center w-6 h-6 rounded-full border border-orange-200 bg-orange-50 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 dark:border-orange-900/50 dark:bg-orange-900/20"
                    >
                        <FolderPlus size={11} strokeWidth={2.5} />
                    </button>
                </Tooltip>
                <Tooltip title="Blacklist this candidate">
                    <button
                        type="button"
                        onClick={onOpenBlock}
                        className="flex items-center justify-center w-6 h-6 rounded-full border border-red-100 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 dark:border-red-900/50 dark:bg-red-900/20"
                    >
                        <FontAwesomeIcon icon={faBan} className="text-[11px]" />
                    </button>
                </Tooltip>
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-100 dark:border-neutral-800">
            <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                        {app.candidateName}
                    </h1>
                    {app.attempt > 1 && (
                        <Tooltip title={`This candidate has applied ${app.attempt} times`}>
                            <Tag color="blue" className="rounded-full px-2.5 py-0.5 border-none bg-blue-50 text-blue-600 font-bold text-[10px] uppercase flex items-center gap-1">
                                <FontAwesomeIcon icon={faClockRotateLeft} className="text-[10px]" />
                                {app.attempt}th Attempt
                            </Tag>
                        </Tooltip>
                    )}
                </div>
                <p className="text-sm text-orange-500 font-medium">{app.jobTitle}</p>
            </div>
            <div className="flex items-center gap-2">
                <Tooltip title="Add to Talent Pool">
                    <button
                        type="button"
                        onClick={onOpenAddToPool}
                        className="flex items-center justify-center w-9 h-9 rounded-full border border-orange-200 bg-orange-50 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 dark:border-orange-900/50 dark:bg-orange-900/20"
                    >
                        <FolderPlus size={18} />
                    </button>
                </Tooltip>
                <Tooltip title="Blacklist this candidate">
                    <button
                        type="button"
                        onClick={onOpenBlock}
                        className="flex items-center justify-center w-9 h-9 rounded-full border border-red-100 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 dark:border-red-900/50 dark:bg-red-900/20"
                    >
                        <FontAwesomeIcon icon={faBan} className="text-[18px]" />
                    </button>
                </Tooltip>
            </div>
        </div>
    );
};

export default CandidateHeader;
