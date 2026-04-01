import React, { useState, useEffect } from 'react';
import { useGetApplicationsQuery, useUpdateApplicationStatusMutation } from '@/apis/applicationApi';
import { useGetJobDetailQuery } from '@/apis/apis';
import { getApplicationStatusConfig, getAllowedNextStatuses, APPLICATION_STATUS } from '@/constrant/application';
import FilterSidebar from '@/pages/application/filterSidebar';
import Loading from '@/components/Loading';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { Drawer, Table, Select, ConfigProvider, Modal as AntModal } from 'antd';
import toastMessage from '@/utils/toastMessage';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faUser } from '../../../utils/icons';
import {
    Search, Filter, Plus,
    ExternalLink, Mail, Calendar, MapPin,
    Eye, Users, Brain, Briefcase
} from 'lucide-react';

const JobApplicants = ({ jobId }) => {
    const navigate = useNavigate();
    const { data: jobData } = useGetJobDetailQuery(jobId, { skip: !jobId });
    const jobStatus = jobData?.data?.status;
    const isUnpublished = jobStatus === 'DRAFT' || jobStatus === 'PENDING_REVIEW';

    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState({ page: 0, size: 10 });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectData, setRejectData] = useState({ id: null, status: null });
    const [rejectReason, setRejectReason] = useState('');

    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [approveData, setApproveData] = useState({ id: null });
    const [evalModal, setEvalModal] = useState({ open: false, evaluation: null, candidateName: '' });

    const [updateStatus] = useUpdateApplicationStatusMutation();

    const { data: appData, isLoading } = useGetApplicationsQuery(
        { ...filter, jobId },
        { skip: !jobId }
    );

    const applications = appData?.data?.content || [];
    const totalElements = appData?.data?.totalElements || 0;

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
            toastMessage.success(`Application moved to ${status} successfully`);
            setIsRejectModalOpen(false);
            setRejectReason('');
            setRejectData({ id: null, status: null });
            setIsApproveModalOpen(false);
            setApproveData({ id: null });
        } catch (error) {
            const errorMessage = error?.data?.message || 'An unexpected error occurred while updating status';
            toastMessage.error(errorMessage);
            if (error?.data?.code === 400 || error?.data?.status === 'BAD_REQUEST') {
                setIsRejectModalOpen(false);
                setIsApproveModalOpen(false);
            }
        }
    };

    const handleStatusSelect = (appId, status) => {
        if (status === 'REJECTED') {
            setRejectData({ id: appId, status });
            setIsRejectModalOpen(true);
        } else if (status === 'APPROVED') {
            setApproveData({ id: appId });
            setIsApproveModalOpen(true);
        } else {
            handleUpdateStatus(appId, status);
        }
    };

    // Active filter count for badge
    const activeFilterCount = [filter.status, filter.location, filter.matchLevel, filter.minScore, filter.skills?.length > 0]
        .filter(Boolean).length;

    const columns = [
        {
            title: 'Candidate',
            dataIndex: 'candidateName',
            key: 'candidateName',
            width: '20%',
            render: (_, app) => (
                <div className="flex items-start gap-3 min-w-0">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-700 flex items-center justify-center mt-0.5">
                        <FontAwesomeIcon icon={faUser} className="text-lg text-gray-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate cursor-pointer hover:text-primary hover:underline transition-colors"
                            onClick={() => navigate(`/applications/${app.applicationId}`)}>
                            {app.candidateName}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 truncate lowercase leading-none mt-1">
                            <Mail size={11} className="flex-shrink-0" /> {app.candidateEmail}
                        </p>
                        {app.location && (
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                <MapPin size={11} className="flex-shrink-0" /> {app.location}
                            </p>
                        )}
                        {app.totalExperienceYears > 0 && (
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                <Briefcase size={11} className="flex-shrink-0" /> {app.totalExperienceYears} years exp.
                            </p>
                        )}
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1.5">
                            <Calendar size={11} className="flex-shrink-0" />
                            {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '--'}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            <StatusTag status={app.status} />
                            {app.isRejectedByAi && (
                                <span className="text-[10px] font-bold tracking-wide text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-md border border-red-200 dark:border-red-800/50 flex items-center gap-1">
                                    <Brain size={10} className="flex-shrink-0" />
                                    AI REJECTED
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: () => (
                <span className="flex items-center gap-1.5">
                    <Brain size={14} className="text-primary" />
                    AI Evaluation
                    <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">beta</span>
                </span>
            ),
            dataIndex: 'evaluation',
            key: 'evaluation',
            width: '55%',
            render: (evaluation, app) => {
                const aiScore = evaluation?.aiScore;
                const criteriaScores = evaluation?.criteriaScores || [];

                if (evaluation && evaluation.status === 'FINISH') {
                    return (
                        <div className="flex items-start gap-5">
                            <div className="flex-shrink-0">
                                <span className={`text-2xl font-bold ${getScoreColor(aiScore)}`}>
                                    {aiScore != null ? `${Math.round(aiScore)}%` : '--'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                {criteriaScores.length > 0 && (
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
                                        {criteriaScores.map((cs, idx) => (
                                            <span key={idx} className="text-xs text-gray-600 dark:text-gray-400">
                                                <span className="text-gray-400 mr-0.5">&bull;</span>
                                                {cs.criteriaName}
                                                <span className={`ml-1 font-semibold ${getScoreColor(cs.aiScore)}`}>
                                                    ({cs.aiScore != null ? `${Math.round(cs.aiScore)}%` : '--'})
                                                </span>
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {(evaluation.strengths || evaluation.weakness) && (
                                    <button
                                        onClick={() => setEvalModal({ open: true, evaluation, candidateName: app.candidateName })}
                                        className="text-xs text-primary hover:underline mt-1"
                                    >
                                        View more
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                }

                return (
                    <span className="text-xs text-gray-400 italic">
                        {evaluation?.status === 'PARTIAL' || evaluation?.status === 'WAITING'
                            ? 'Evaluating...'
                            : evaluation?.status === 'FAIL'
                                ? 'Failed'
                                : 'Not evaluated'}
                    </span>
                );
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '20%',
            align: 'center',
            render: (_, app) => {
                const allowedStatuses = getAllowedNextStatuses(app.status, app.isRejectedByAi);
                const statusOptions = allowedStatuses.map((key) => ({
                    value: key,
                    label: APPLICATION_STATUS[key]?.label || key,
                }));

                return (
                    <div className="flex items-center justify-center gap-2">
                        {statusOptions.length > 0 && (
                            <ConfigProvider theme={{ token: { colorPrimary: '#f97316', colorBorderHover: '#f97316' } }}>
                                <Select
                                    placeholder="Change status..."
                                    onChange={(status) => handleStatusSelect(app.applicationId, status)}
                                    className="w-40 h-9"
                                    options={statusOptions}
                                    size="middle"
                                    value={null}
                                />
                            </ConfigProvider>
                        )}
                        <button
                            onClick={() => navigate(`/applications/${app.applicationId}`)}
                            className="p-2.5 bg-gray-50 dark:bg-neutral-800 hover:bg-orange-500/10 text-gray-400 hover:text-orange-500 rounded-xl transition-all border border-transparent hover:border-orange-500/20"
                            title="View Details"
                        >
                            <Eye size={16} />
                        </button>
                        {app.resumeId && (
                            <button
                                onClick={() => navigate(`/cv-preview/${app.resumeId}`)}
                                className="p-2.5 bg-gray-50 dark:bg-neutral-800 hover:bg-primary/10 text-gray-400 hover:text-primary rounded-xl transition-all border border-transparent hover:border-primary/20"
                                title="View Resume"
                            >
                                <ExternalLink size={16} />
                            </button>
                        )}
                    </div>
                );
            },
        },
    ];

    if (isUnpublished) {
        return (
            <PublishFirstPlaceholder
                description="Applicants will appear here once your job is published and candidates start applying."
            />
        );
    }

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
                <div className="border border-neutral-200 rounded-xl overflow-hidden">
                    <Table
                        columns={columns}
                        dataSource={applications}
                        rowKey="applicationId"
                        loading={isLoading}
                        locale={{
                            emptyText: (
                                <div className="flex flex-col items-center justify-center py-10 gap-3">
                                    <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center">
                                        <Users size={28} className="text-orange-400" />
                                    </div>
                                    <p className="text-sm font-semibold text-neutral-500">No applicants yet</p>
                                    <p className="text-xs text-neutral-400">Candidates who apply for this job will appear here.</p>
                                </div>
                            ),
                        }}
                        pagination={{
                            current: page + 1,
                            pageSize: 10,
                            total: totalElements || 0,
                            onChange: (p) => setPage(p - 1),
                            showSizeChanger: false,
                        }}
                    />
                </div>
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

            {/* Approve Modal */}
            <Modal
                open={isApproveModalOpen}
                title="Approve Candidate"
                onCancel={() => setIsApproveModalOpen(false)}
                onSubmit={() => handleUpdateStatus(approveData.id, 'APPROVED')}
                submitText="Confirm & Approve"
                width={420}
            >
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Are you sure to move this application to <span className="text-green-600 font-medium">Approved</span> status? This action cannot be undone.
                </p>
            </Modal>

            {/* AI Evaluation Modal */}
            <AntModal
                open={evalModal.open}
                title={<span className="font-semibold">AI Evaluation — {evalModal.candidateName}</span>}
                onCancel={() => setEvalModal({ open: false, evaluation: null, candidateName: '' })}
                footer={null}
                width={900}
            >
                {evalModal.evaluation && (
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-4">
                            <span className={`text-3xl font-bold ${getScoreColor(evalModal.evaluation.aiScore)}`}>
                                {evalModal.evaluation.aiScore != null ? `${Math.round(evalModal.evaluation.aiScore)}%` : '--'}
                            </span>
                            {(evalModal.evaluation.criteriaScores || []).length > 0 && (
                                <div className="flex flex-wrap gap-x-4 gap-y-1">
                                    {evalModal.evaluation.criteriaScores.map((cs, idx) => (
                                        <span key={idx} className="text-sm text-gray-700 dark:text-gray-400">
                                            <span className="text-gray-400 mr-0.5">&bull;</span>
                                            {cs.criteriaName}
                                            <span className={`ml-1 font-semibold ${getScoreColor(cs.aiScore)}`}>
                                                ({cs.aiScore != null ? `${Math.round(cs.aiScore)}%` : '--'})
                                            </span>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        {(evalModal.evaluation.strengths || evalModal.evaluation.weakness) && (
                            <div className="grid grid-cols-2 gap-6">
                                {evalModal.evaluation.strengths && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-semibold text-emerald-600">Strengths</p>
                                        {parseBullets(evalModal.evaluation.strengths).map((item, i) => (
                                            <p key={`s-${i}`} className="text-sm text-gray-700 dark:text-gray-400 flex items-start gap-1">
                                                <span className="text-emerald-500 mt-px">+</span> {item}
                                            </p>
                                        ))}
                                    </div>
                                )}
                                {evalModal.evaluation.weakness && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-semibold text-red-500">Weaknesses</p>
                                        {parseBullets(evalModal.evaluation.weakness).map((item, i) => (
                                            <p key={`w-${i}`} className="text-sm text-gray-700 dark:text-gray-400 flex items-start gap-1">
                                                <span className="text-red-500 mt-px">-</span> {item}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </AntModal>

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

const PublishFirstPlaceholder = ({ description }) => (
    <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fadeIn">
        <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center">
            <FontAwesomeIcon icon={faRocket} className="text-4xl text-amber-400" />
        </div>
        <h3 className="text-lg font-bold text-neutral-800 dark:text-white">Publish your job first</h3>
        <p className="text-sm text-neutral-400 text-center max-w-sm">{description}</p>
    </div>
);

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
    if (score == null) return 'text-gray-300';
    if (score >= 80) return 'text-emerald-500';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-500';
};

const parseBullets = (text) => {
    if (!text) return [];
    return text
        .split('\n')
        .map(line => line.replace(/^[-*•+]\s*/, '').trim())
        .filter(line => line.length > 0);
};

export default JobApplicants;
