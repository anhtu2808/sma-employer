import React from 'react';
import { Select, ConfigProvider, Tooltip } from 'antd';
import { APPLICATION_STATUS, getApplicationStatusConfig } from '@/constrant/application';
import Button from '@/components/Button';

const Overview = ({ app, onStatusChange, isUpdating, onOpenBlock }) => {
    const statusConfig = app.status
        ? getApplicationStatusConfig(app.status)
        : { label: 'N/A', textColor: 'text-gray-500' };

    const statusOptions = Object.entries(APPLICATION_STATUS).map(([key, val]) => ({
        value: key,
        label: val.label,
    }));

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                        {app.candidateName}
                    </h1>
                    <p className="text-sm text-orange-500 font-medium mt-0.5">
                        {app.jobTitle}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {app.candidateEmail && <span>{app.candidateEmail}</span>}
                        {app.candidatePhone && <span>• {app.candidatePhone}</span>}
                        {app.location && <span>• {app.location}</span>}
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
                    <ConfigProvider theme={{ token: { colorPrimary: '#f97316', colorBorderHover: '#f97316' } }}>
                        <Select
                            value={app.status}
                            onChange={onStatusChange}
                            loading={isUpdating}
                            className="w-full md:w-40 h-10"
                            options={statusOptions}
                        />
                    </ConfigProvider>
                    {app.resumeUrl && (
                        <Button
                            mode="secondary"
                            size="md"
                            shape="round"
                            onClick={() => window.open(app.resumeUrl, '_blank')}
                        >
                            Download CV
                        </Button>
                    )}
                    <Tooltip title="Blacklist this candidate">
                        <button
                            type="button"
                            onClick={onOpenBlock}
                            className="flex items-center justify-center w-10 h-10 rounded-full border border-red-100 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm"
                        >
                            <span className="material-symbols-outlined text-[20px]">block</span>
                        </button>
                    </Tooltip>
                </div>
            </div>

            {/* Meta info row */}
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                <span className={`font-semibold ${statusConfig.textColor}`}>{statusConfig.label}</span>
                {app.appliedAt && (
                    <span>Applied {new Date(app.appliedAt).toLocaleDateString()}</span>
                )}
                {app.aiScore != null && (
                    <span>AI Score: <span className="font-semibold text-orange-500">{app.aiScore}%</span></span>
                )}
                {app.isRejectedByAi && (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded bg-opacity-80 border border-red-200 dark:border-red-800/50">
                        <span className="material-symbols-outlined text-[14px]">psychology</span>
                        AI REJECTED
                    </span>
                )}
                {app.source && <span>Source: {app.source}</span>}
            </div>
        </div>
    );
};

export default Overview;
