import React, { useState, useEffect } from 'react';
import { useGetApplicationsQuery, useUpdateApplicationStatusMutation } from '@/apis/applicationApi';
import { getApplicationStatusConfig } from '@/constrant/application';
import FilterSidebar from '@/pages/application/filterSidebar';
import Loading from '@/components/Loading';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { Drawer, Dropdown, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    Search, Filter, Plus,
    ExternalLink, Mail, Calendar, MapPin, MoreVertical,
    ChevronLeft, ChevronRight, Eye, Users
} from 'lucide-react';

const JobApplicants = ({ jobId }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState({ page: 0, size: 10 });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [page, setPage] = useState(0);

    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectData, setRejectData] = useState({ id: null, status: null });
    const [rejectReason, setRejectReason] = useState('');

    const [updateStatus] = useUpdateApplicationStatusMutation();

    const { data: appData, isLoading } = useGetApplicationsQuery(
        { ...filter, jobId },
        { skip: !jobId }
    );

    const applications = appData?.data?.content || [];
    const totalElements = appData?.data?.totalElements || 0;
    const totalPages = appData?.data?.totalPages || 0;

    useEffect(() => {
        setFilter(prev => ({ ...prev, page }));
    }, [page]);

    // Debounced search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setFilter(prev => ({
                ...prev,
                keyword: searchTerm || undefined,
                page: 0
            }));
            setPage(0);
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleUpdateStatus = async (id, status, reason = null) => {
        try {
            await updateStatus({ id, status, rejectReason: reason }).unwrap();
            message.success(`Application moved to ${status} successfully`);
            setIsRejectModalOpen(false);
            setRejectReason('');
            setRejectData({ id: null, status: null });
        } catch (error) {
            const errorMessage = error?.data?.message || 'An unexpected error occurred while updating status';
            message.error(errorMessage);
            if (error?.data?.code === 400 || error?.data?.status === 'BAD_REQUEST') {
                setIsRejectModalOpen(false);
            }
        }
    };

    const isStatusUpdateDisabled = (current, target) => {
        if (current === target) return true;
        if (current === 'VIEWED') return !['SHORTLISTED', 'APPROVED', 'REJECTED'].includes(target);
        if (current === 'SHORTLISTED') return !['REJECTED', 'APPROVED'].includes(target);
        if (current === 'REJECTED') return target !== 'APPROVED';
        if (['APPLIED', 'APPROVED', 'AUTO_REJECTED'].includes(current)) return true;
        return true;
    };

    const getStatusMenu = (app) => {
        const statuses = ['APPLIED', 'VIEWED', 'SHORTLISTED', 'REJECTED', 'APPROVED', 'AUTO_REJECTED'];
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
                    disabled: isStatusUpdateDisabled(app.status, statusId),
                    onClick: () => {
                        if (statusId === 'REJECTED') {
                            setRejectData({ id: app.applicationId, status: statusId });
                            setIsRejectModalOpen(true);
                        } else {
                            handleUpdateStatus(app.applicationId, statusId);
                        }
                    }
                };
            })
        };
    };

    // Active filter count for badge
    const activeFilterCount = [filter.status, filter.location, filter.matchLevel, filter.minScore, filter.skills?.length > 0]
        .filter(Boolean).length;

    return (
        <div className="flex flex-col gap-4 animate-fadeIn">
            {/* Header bar: search + filter */}
            <div className="bg-white dark:bg-surface-dark shadow-sm border border-neutral-100 dark:border-neutral-800 rounded-2xl p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <Users size={16} className="text-primary" />
                        <span className="font-semibold text-neutral-800 dark:text-white">{totalElements}</span> applicants found
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400/80" />
                            <input
                                type="text"
                                placeholder="Search candidates..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-neutral-50 dark:bg-gray-900 border border-neutral-100 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-neutral-400/60 dark:text-white shadow-sm w-64"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                                >
                                    <Plus size={16} className="rotate-45" />
                                </button>
                            )}
                        </div>
                        <Button
                            mode="secondary"
                            shape="round"
                            iconLeft={<Filter size={16} />}
                            onClick={() => setIsFilterOpen(true)}
                        >
                            Filters{activeFilterCount > 0 && ` (${activeFilterCount})`}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-surface-dark shadow-sm border border-neutral-100 dark:border-neutral-800 rounded-2xl overflow-hidden flex flex-col" style={{ minHeight: 320 }}>
                {isLoading ? (
                    <Loading className="py-20" size={96} />
                ) : applications.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
                        <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center">
                            <Users size={28} className="text-orange-400" />
                        </div>
                        <p className="text-sm font-semibold text-neutral-500">No applicants yet</p>
                        <p className="text-xs text-neutral-400">Candidates who apply for this job will appear here.</p>
                    </div>
                ) : (
                    <>
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
                                    {applications.map((app) => (
                                        <tr key={app.applicationId} className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4 min-w-0">
                                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-xs border border-orange-200">
                                                        {app.candidateName?.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0 flex-1 cursor-pointer" onClick={() => navigate(`/applications/${app.applicationId}`)}>
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary group-hover:underline transition-colors">
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
                                                        {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '--'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1.5 truncate">
                                                        <MapPin size={12} /> {app.location || 'Vietnam'}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={() => navigate(`/applications/${app.applicationId}`)}
                                                        className="p-2.5 bg-gray-50 dark:bg-neutral-800 hover:bg-orange-500/10 text-gray-400 hover:text-orange-500 rounded-xl transition-all border border-transparent hover:border-orange-500/20"
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => window.open(app.resumeUrl, '_blank')}
                                                        className="p-2.5 bg-gray-50 dark:bg-neutral-800 hover:bg-primary/10 text-gray-400 hover:text-primary rounded-xl transition-all border border-transparent hover:border-primary/20"
                                                        title="View Resume"
                                                    >
                                                        <ExternalLink size={16} />
                                                    </button>
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

                        {/* Pagination */}
                        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-50 dark:border-neutral-800 bg-white dark:bg-surface-dark flex items-center justify-between">
                            <p className="text-xs font-medium text-gray-500">
                                Showing <span className="text-gray-900 dark:text-white font-semibold">{applications.length}</span> of <span className="text-gray-900 dark:text-white font-semibold">{totalElements}</span> Candidates
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(Math.max(0, page - 1))}
                                    disabled={page === 0}
                                    className={`p-2 rounded-xl transition-all ${page === 0 ? 'text-gray-200' : 'text-gray-400 hover:bg-gray-100'}`}
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <div className="flex items-center gap-1">
                                    {[...Array(totalPages)].map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setPage(index)}
                                            className={`w-8 h-8 text-sm font-medium rounded-lg transition-all ${page === index
                                                ? 'bg-orange-500 text-white shadow-sm'
                                                : 'text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setPage(page + 1)}
                                    disabled={page >= totalPages - 1}
                                    className={`p-2 rounded-xl transition-all ${page >= totalPages - 1 ? 'text-gray-200' : 'text-gray-400 hover:bg-gray-100'}`}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Reject Modal */}
            <Modal
                open={isRejectModalOpen}
                title="Reject Candidate"
                onCancel={() => {
                    setIsRejectModalOpen(false);
                    setRejectReason('');
                }}
                onSubmit={() => handleUpdateStatus(rejectData.id, rejectData.status, rejectReason)}
                submitText="Confirm & Reject"
                danger
                width={500}
            >
                <div className="text-left space-y-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Are you sure to move this application to <span className="text-red-500 font-medium">Rejected</span> status? Please state the reason.
                    </p>
                    <div className="space-y-2">
                        <label className="flex justify-between items-center px-1">
                            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                Reason for rejection
                            </span>
                            <span className="text-xs text-neutral-400">(Optional)</span>
                        </label>
                        <textarea
                            rows={4}
                            autoFocus
                            placeholder="Provide a reason or leave it blank to continue..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="w-full p-4 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 transition-all resize-none font-body"
                        />
                    </div>
                </div>
            </Modal>

            {/* Filter Drawer */}
            <Drawer
                title={<span className="font-heading font-bold text-lg">Filter Applicants</span>}
                placement="right"
                onClose={() => setIsFilterOpen(false)}
                open={isFilterOpen}
                width={500}
                className="custom-drawer"
            >
                <FilterSidebar
                    currentFilters={filter}
                    onApply={(newFilters) => {
                        setFilter(prev => ({
                            ...prev,
                            ...newFilters,
                            page: 0
                        }));
                        setPage(0);
                        setIsFilterOpen(false);
                    }}
                    onReset={(resetState) => setFilter({ ...resetState, jobId, page: 0, size: 10 })}
                />
            </Drawer>
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

export default JobApplicants;
