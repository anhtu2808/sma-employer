import React from 'react';
import { message, Select, ConfigProvider } from 'antd';
import { APPLICATION_STATUS, getApplicationStatusConfig, getAllowedNextStatuses } from '@/constrant/application';

const CopyableField = ({ icon, value, href }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(value).then(() => {
            message.success('Copied!');
        });
    };

    return (
        <div className="flex items-center gap-2.5 text-sm group">
            <span className="material-icons-round text-base text-gray-400">{icon}</span>
            {href ? (
                <a href={href} className="text-gray-700 dark:text-neutral-300 hover:text-orange-500 transition-colors">
                    {value}
                </a>
            ) : (
                <span className="text-gray-700 dark:text-neutral-300">{value}</span>
            )}
            <button
                onClick={handleCopy}
                className="p-0.5 rounded text-gray-300 hover:text-orange-500 opacity-0 group-hover:opacity-100 transition-all"
                title="Copy"
            >
                <span className="material-icons-round text-[14px]">content_copy</span>
            </button>
        </div>
    );
};

const Overview = ({ app, onSwitchToAiTab, onStatusChange, isUpdating, isRejectedByAi }) => {
    const statusConfig = app.status
        ? getApplicationStatusConfig(app.status)
        : { label: 'N/A', textColor: 'text-gray-500' };

    const allowedStatuses = getAllowedNextStatuses(app.status, isRejectedByAi);
    const statusOptions = allowedStatuses.map((key) => ({
        value: key,
        label: APPLICATION_STATUS[key]?.label || key,
    }));

    return (
        <div className="space-y-5">
            {/* Contact Info */}
            <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Contact</h4>
                <div className="flex flex-col gap-2">
                    {app.candidateEmail && (
                        <CopyableField icon="email" value={app.candidateEmail} href={`mailto:${app.candidateEmail}`} />
                    )}
                    {app.candidatePhone && (
                        <CopyableField icon="phone" value={app.candidatePhone} href={`tel:${app.candidatePhone}`} />
                    )}
                    {app.location && (
                        <CopyableField icon="location_on" value={app.location} />
                    )}
                </div>
            </div>

            {/* Application Meta */}
            <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Application Info</h4>
                {statusOptions.length > 0 && (
                    <div className="flex items-center gap-3">
                        <ConfigProvider theme={{ token: { colorPrimary: '#f97316', colorBorderHover: '#f97316' } }}>
                            <Select
                                placeholder="Change status..."
                                onChange={onStatusChange}
                                loading={isUpdating}
                                className="w-44 h-9"
                                options={statusOptions}
                                size="middle"
                            />
                        </ConfigProvider>
                    </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1 p-3 bg-gray-50 dark:bg-neutral-800/50 rounded-xl">
                        <span className="text-xs text-gray-400">Status</span>
                        <span className={`text-sm font-semibold ${statusConfig.textColor}`}>{statusConfig.label}</span>
                    </div>
                    {app.appliedAt && (
                        <div className="flex flex-col gap-1 p-3 bg-gray-50 dark:bg-neutral-800/50 rounded-xl">
                            <span className="text-xs text-gray-400">Applied</span>
                            <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">
                                {new Date(app.appliedAt).toLocaleDateString()}
                            </span>
                        </div>
                    )}
                    {app.source && (
                        <div className="flex flex-col gap-1 p-3 bg-gray-50 dark:bg-neutral-800/50 rounded-xl">
                            <span className="text-xs text-gray-400">Source</span>
                            <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">{app.source}</span>
                        </div>
                    )}
                    {app.aiScore != null && (
                        <button
                            onClick={onSwitchToAiTab}
                            className="flex flex-col gap-1 p-3 bg-orange-50 dark:bg-orange-900/10 rounded-xl text-left hover:bg-orange-100 dark:hover:bg-orange-900/20 transition-colors group"
                        >
                            <span className="text-xs text-orange-400">AI Score</span>
                            <span className="text-sm font-bold text-orange-500 group-hover:text-orange-600">
                                {app.aiScore}%
                                <span className="material-icons-round text-[13px] ml-1 opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                            </span>
                        </button>
                    )}
                </div>
            </div>

            {/* Decision History */}
            {(app.status === 'REJECTED' || app.status === 'APPROVED') && (
                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                            <span className={`material-icons-round text-sm ${app.status === 'REJECTED' ? 'text-red-500' : 'text-green-500'}`}>
                                {app.status === 'REJECTED' ? 'cancel' : 'check_circle'}
                            </span>
                            Decision History
                        </span>
                    </h4>
                    <div className="p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-xl space-y-3">
                        <div className="space-y-2">
                            <div>
                                <span className="text-xs text-gray-400">Processed By</span>
                                <p className="text-sm font-medium text-gray-700 dark:text-neutral-300 mt-0.5 break-all">
                                    {app.reviewedByEmail || 'System / Auto'}
                                </p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-400">Processed At</span>
                                <p className="text-sm font-medium text-gray-700 dark:text-neutral-300 mt-0.5">
                                    {app.reviewedAt ? new Date(app.reviewedAt).toLocaleString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                        {app.status === 'REJECTED' && app.rejectReason && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-red-600">Rejection Reason</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${app.showRejectReason ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                        {app.showRejectReason ? 'Visible to Candidate' : 'Internal Only'}
                                    </span>
                                </div>
                                <p className="text-sm text-red-700 dark:text-red-300/80 italic">{app.rejectReason}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Overview;
