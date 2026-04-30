import React from 'react';
import { Tooltip, Tag } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faClockRotateLeft } from '../../../../utils/icons';
import { FolderPlus } from 'lucide-react';

const CandidateHeader = ({ app, onOpenBlock, onOpenAddToPool, compact = false }) => {
    const currentPool = app.poolInfo || null;
    const isInTalentPool = Boolean(currentPool || app.isInTalentPool);
    const poolActionTitle = isInTalentPool ? 'Move to another pool' : 'Add to Talent Pool';

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
                {currentPool && (
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-100 bg-orange-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-orange-600">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: currentPool.color || '#f97316' }} />
                        <span className="max-w-[110px] truncate">{currentPool.name}</span>
                    </div>
                )}
                {onOpenAddToPool && (
                    <Tooltip title={poolActionTitle}>
                        <button
                            type="button"
                            onClick={onOpenAddToPool}
                            className="flex items-center justify-center w-6 h-6 rounded-full border border-orange-200 bg-orange-50 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 dark:border-orange-900/50 dark:bg-orange-900/20"
                        >
                            <FolderPlus size={11} strokeWidth={2.5} />
                        </button>
                    </Tooltip>
                )}
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
                {currentPool && (
                    <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: currentPool.color || '#f97316' }} />
                        <span className="truncate max-w-[220px]">In {currentPool.name}</span>
                    </div>
                )}
            </div>
            <div className="flex items-center gap-2">
                {onOpenAddToPool && (
                    <Tooltip title={poolActionTitle}>
                        <button
                            type="button"
                            onClick={onOpenAddToPool}
                            className="flex items-center justify-center w-9 h-9 rounded-full border border-orange-200 bg-orange-50 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 dark:border-orange-900/50 dark:bg-orange-900/20"
                        >
                            <FolderPlus size={18} />
                        </button>
                    </Tooltip>
                )}
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
