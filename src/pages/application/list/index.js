import React from 'react';
import { ExternalLink, Mail, Calendar, MapPin, MoreVertical, Brain } from 'lucide-react';
import moment from 'moment';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Menu, Dropdown } from 'antd';

const ApplicationList = ({ data, isLoading, totalElements, totalPages, currentPage, onPageChange, onStatusUpdate }) => {

    const getStatusMenu = (app) => {
        const statuses = [
            { id: 'APPLIED', label: 'Applied', color: 'text-orange-500' },
            { id: 'VIEWED', label: 'Viewed', color: 'text-indigo-500' },
            { id: 'SHORTLISTED', label: 'Shortlisted', color: 'text-emerald-500' },
            { id: 'NOT_SUITABLE', label: 'Not Suitable', color: 'text-red-500' },
            { id: 'AUTO_REJECTED', label: 'Auto Rejected', color: 'text-gray-500' }
        ];

        return {
            items: statuses.map(s => ({
                key: s.id,
                label: (
                    <span className={`text-[11px] font-bold uppercase tracking-tight ${s.color}`}>
                        {s.label}
                    </span>
                ),
                disabled:
                    app.status === s.id ||
                    app.status === 'NOT_SUITABLE' ||
                    app.status === 'AUTO_REJECTED',
                onClick: () => onStatusUpdate(app.applicationId, s.id)
            }))
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
            rounded-b-[24px] border border-t-0 border-neutral-100 dark:border-neutral-800 overflow-hidden">

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse table-fixed">
                    <thead className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-900 shadow-sm">
                        <tr>
                            <th className="px-6 py-4 w-[35%] text-[10px] font-black text-neutral-400 uppercase tracking-widest">Candidate</th>
                            <th className="px-6 py-4 w-[15%] text-[10px] font-black text-neutral-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 w-[15%] text-[10px] font-black text-neutral-400 uppercase tracking-widest text-center">AI Match</th>
                            <th className="px-6 py-4 w-[25%] text-[10px] font-black text-neutral-400 uppercase tracking-widest">Applied Date</th>
                            <th className="px-6 py-4 w-[10%] text-center text-[10px] font-black text-neutral-400 uppercase tracking-widest">Action</th>
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
                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                                {app.candidateName}
                                            </p>
                                            <p className="text-[11px] text-gray-400 flex items-center gap-1 truncate lowercase leading-none mt-1">
                                                <Mail size={12} className="flex-shrink-0" /> {app.candidateEmail}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <StatusTag status={app.status} />
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`text-sm font-black ${getScoreColor(app.aiScore)}`}>
                                        {app.aiScore ? `${app.aiScore}%` : '--'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-0.5">
                                        <p className="text-xs font-bold text-gray-600 dark:text-neutral-400 flex items-center gap-1.5">
                                            <Calendar size={13} className="text-gray-300" />
                                            {moment(app.appliedAt).format('DD MMM, YYYY')}
                                        </p>
                                        <p className="text-[10px] text-gray-400 flex items-center gap-1.5 truncate">
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
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Showing <span className="text-gray-900 dark:text-white">{data.length}</span> of <span className="text-gray-900 dark:text-white">{totalElements}</span> Candidates
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
                                className={`w-8 h-8 text-xs font-bold rounded-lg transition-all ${currentPage === index
                                    ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                                    : 'text-gray-500 hover:bg-gray-100'
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
    const config = {
        APPLIED: { label: 'APPLIED', color: 'bg-orange-50 text-orange-600', dot: 'bg-orange-600' },
        VIEWED: { label: 'IN REVIEW', color: 'bg-blue-50 text-blue-600', dot: 'bg-blue-600' },
        SHORTLISTED: { label: 'SHORTLISTED', color: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-600' },
        NOT_SUITABLE: { label: 'REJECTED', color: 'bg-red-50 text-red-600', dot: 'bg-red-600' },
        AUTO_REJECTED: { label: 'AUTO REJECTED', color: 'bg-gray-100 text-gray-500', dot: 'bg-gray-500' },
    }[status] || { label: status, color: 'bg-gray-50 text-gray-600', dot: 'bg-gray-600' };

    return (
        <span className={`px-3 py-1 rounded-lg text-[10px] font-black flex items-center gap-2 w-fit uppercase tracking-wider ${config.color}`}>
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