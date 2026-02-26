import React from 'react';
import { ExternalLink, Mail, Calendar, MapPin, MoreVertical, Brain } from 'lucide-react';
import moment from 'moment';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Menu, Dropdown } from 'antd';
import { getApplicationStatusConfig } from '@/constrant/application';
const ApplicationList = ({ data, isLoading, totalElements, totalPages, currentPage, onPageChange, onStatusUpdate }) => {

    const getStatusMenu = (app) => {
        const statuses = ['APPLIED', 'VIEWED', 'SHORTLISTED', 'NOT_SUITABLE', 'AUTO_REJECTED'];

        return {
            items: statuses.map(statusId => {
                const s = getApplicationStatusConfig(statusId);
                return {
                    key: statusId,
                    label: (
                        <span className={`text-xs font-semibold tracking-wide ${s.textColor}`}>
                            {s.label}
                        </span>
                    ),
                    disabled:
                        app.status === statusId ||
                        app.status === 'NOT_SUITABLE' ||
                        app.status === 'AUTO_REJECTED',
                    onClick: () => onStatusUpdate(app.applicationId, statusId)
                };
            })
        };
    };


    if (isLoading) return (
        <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );


    if (isLoading) return (
        <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="h-full flex flex-col bg-white dark:bg-surface-dark 
            rounded-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden">

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse table-fixed">
                    <thead className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-900 shadow-sm">
                        <tr>
                            <th className="px-6 py-4 w-[35%] text-sm font-semibold text-gray-500 tracking-wide">Candidate</th>
                            <th className="px-6 py-4 w-[15%] text-sm font-semibold text-gray-500 tracking-wide">Status</th>
                            <th className="px-6 py-4 w-[15%] text-sm font-semibold text-gray-500 tracking-wide text-center">AI Match</th>
                            <th className="px-6 py-4 w-[25%] text-sm font-semibold text-gray-500 tracking-wide">Applied Date</th>
                            <th className="px-6 py-4 w-[10%] text-center text-sm font-semibold text-gray-500 tracking-wide">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-neutral-800">
                        {data.map((app) => (
                            <tr key={app.applicationId} className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-xs border border-orange-200">
                                            {app.candidateName.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                {app.candidateName}
                                            </p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1 truncate lowercase leading-none mt-1">
                                                <Mail size={12} className="flex-shrink-0" /> {app.candidateEmail}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <StatusTag status={app.status} />
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`text-sm font-semibold ${getScoreColor(app.aiScore)}`}>
                                        {app.aiScore ? `${app.aiScore}%` : '--'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-0.5">
                                        <p className="text-sm text-gray-700 dark:text-neutral-300 flex items-center gap-1.5">
                                            <Calendar size={13} className="text-gray-400" />
                                            {moment(app.appliedAt).format('DD MMM, YYYY')}
                                        </p>
                                        <p className="text-xs text-gray-500 flex items-center gap-1.5 truncate">
                                            <MapPin size={12} /> {app.location || 'Vietnam'}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        {/* View CV Button */}
                                        <button
                                            onClick={() => window.open(app.resumeUrl, '_blank')}
                                            className="p-2.5 bg-gray-50 dark:bg-neutral-800 hover:bg-primary/10 text-gray-400 hover:text-primary rounded-xl transition-all border border-transparent hover:border-primary/20"
                                            title="View Resume"
                                        >
                                            <ExternalLink size={16} />
                                        </button>

                                        {/* Status Update Dropdown */}
                                        <Dropdown
                                            menu={getStatusMenu(app)}
                                            trigger={['click']}
                                            placement="bottomRight"
                                        >
                                            <button className="p-2.5 bg-gray-50 dark:bg-neutral-800 hover:bg-neutral-100 text-gray-400 hover:text-neutral-600 rounded-xl transition-all border border-transparent">
                                                <MoreVertical size={18} />
                                            </button>
                                        </Dropdown>

                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            <div className="flex-shrink-0 px-6 py-4 border-t border-gray-50 dark:border-neutral-800 bg-white dark:bg-surface-dark flex items-center justify-between">
                <p className="text-xs font-medium text-gray-500">
                    Showing <span className="text-gray-900 dark:text-white font-semibold">{data.length}</span> of <span className="text-gray-900 dark:text-white font-semibold">{totalElements}</span> Candidates
                </p>

                <div className="flex items-center gap-2">
                    {/* Prev Button */}
                    <button
                        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
                        disabled={currentPage === 0}
                        className={`p-2 rounded-xl transition-all ${currentPage === 0 ? 'text-gray-200' : 'text-gray-400 hover:bg-gray-100'}`}
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => onPageChange(index)}
                                className={`w-8 h-8 text-sm font-medium rounded-lg transition-all ${currentPage === index
                                    ? 'bg-orange-500 text-white shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages - 1}
                        className={`p-2 rounded-xl transition-all ${currentPage >= totalPages - 1 ? 'text-gray-200' : 'text-gray-400 hover:bg-gray-100'}`}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Helper Components
const StatusTag = ({ status }) => {
    const config = getApplicationStatusConfig(status);

    return (
        <span className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-2 w-fit tracking-wide ${config.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
};

const getScoreColor = (score) => {
    if (!score) return 'text-gray-300';
    if (score >= 80) return 'text-emerald-500';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-500';
};

export default ApplicationList;