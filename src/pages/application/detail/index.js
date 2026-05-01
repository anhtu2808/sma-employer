import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Checkbox, Popover, Slider, Select, ConfigProvider } from 'antd';
import toastMessage from '@/utils/toastMessage';
import { useGetApplicationDetailQuery, useGetApplicationsQuery, useUpdateApplicationStatusMutation } from '@/apis/applicationApi';
import { useGetTalentPoolsQuery, useAddTalentPoolItemMutation, useCreateTalentPoolMutation, useMoveTalentPoolItemMutation } from '@/apis/talentPoolApi';
import { APPLICATION_STATUS, getAllowedNextStatuses } from '@/constrant/application';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import { useBlockCandidateMutation } from '@/apis/companyApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faNewspaper,
    faTriangleExclamation,
    faCircleCheck,
} from '../../../utils/icons';
import { Sparkles, Plus, GitCompareArrows, Search } from 'lucide-react';
import { ManualScoreBadge } from '../ManualScorePopover';
import CandidateHeader from './candidate-header';
import BasicInformation from './basic-information';
import AiAnalysis from './ai-analysis';
import CoverLetter from './cover-letter';
import PdfViewer from './pdf-viewer';
import CreatePoolModal from '../../talent-pool/create-pool-modal';
import { normalizeApplicationDetail } from './utils';

const TAB_KEYS = {
    BASIC: 'basic',
    AI: 'ai',
    COVER: 'cover',
};

const COMPARE_STATUS_META = {
    WAITING: {
        label: 'Evaluating',
        badgeClassName: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/40',
        helperText: 'AI evaluation is still running, so this application cannot be compared yet.',
    },
    PARTIAL: {
        label: 'Evaluating',
        badgeClassName: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/40',
        helperText: 'AI evaluation is still running, so this application cannot be compared yet.',
    },
    FAIL: {
        label: 'AI Failed',
        badgeClassName: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/40',
        helperText: 'AI evaluation failed, so this application cannot be compared yet.',
    },
    UNAVAILABLE: {
        label: 'No AI Score',
        badgeClassName: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700',
        helperText: 'This application does not have a completed AI evaluation yet.',
    },
};

const formatScore = (value) => (
    typeof value === 'number' ? `${Math.round(value)}%` : 'N/A'
);

const getApplicationAiScore = (application) => (
    typeof application?.evaluation?.aiScore === 'number' ? application.evaluation.aiScore : null
);

const getCompareStatusKey = (application) => {
    const status = application?.evaluation?.status;

    if (status === 'FINISH' || status === 'WAITING' || status === 'PARTIAL' || status === 'FAIL') {
        return status;
    }

    return 'UNAVAILABLE';
};

const getCompareAvailability = (application) => {
    const statusKey = getCompareStatusKey(application);

    if (statusKey === 'FINISH') {
        return {
            enabled: true,
            statusKey,
            label: 'Ready',
            helperText: '',
            badgeClassName: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/40',
        };
    }

    return {
        enabled: false,
        statusKey,
        ...COMPARE_STATUS_META[statusKey],
    };
};

const compareCandidateNames = (left, right) => (
    (left?.candidateName || '').localeCompare(right?.candidateName || '')
);

const sortCompareCandidates = (left, right) => {
    const leftAvailability = getCompareAvailability(left);
    const rightAvailability = getCompareAvailability(right);

    if (leftAvailability.enabled !== rightAvailability.enabled) {
        return leftAvailability.enabled ? -1 : 1;
    }

    const leftScore = getApplicationAiScore(left);
    const rightScore = getApplicationAiScore(right);

    if (typeof leftScore === 'number' && typeof rightScore === 'number' && leftScore !== rightScore) {
        return rightScore - leftScore;
    }
    if (typeof leftScore === 'number' && typeof rightScore !== 'number') {
        return -1;
    }
    if (typeof leftScore !== 'number' && typeof rightScore === 'number') {
        return 1;
    }

    return compareCandidateNames(left, right);
};

const ApplicationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: appResponse, isLoading, refetch } = useGetApplicationDetailQuery(id, { skip: !id });
    const [updateStatus, { isLoading: isUpdating }] = useUpdateApplicationStatusMutation();
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [blockReason, setBlockReason] = useState('');
    const [blockCandidate, { isLoading: isBlocking }] = useBlockCandidateMutation();
    const [activeTab, setActiveTab] = useState(TAB_KEYS.BASIC);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [showToCandidate, setShowToCandidate] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [compareSearch, setCompareSearch] = useState('');
    const [debouncedCompareSearch, setDebouncedCompareSearch] = useState('');
    const [compareMinScore, setCompareMinScore] = useState(0);

    const [isPoolModalOpen, setIsPoolModalOpen] = useState(false);
    const [isCreatePoolOpen, setIsCreatePoolOpen] = useState(false);
    const { data: poolsResponse } = useGetTalentPoolsQuery();
    const pools = poolsResponse?.data || [];
    const [addTalentPoolItem, { isLoading: isAddingToPool }] = useAddTalentPoolItemMutation();
    const [moveTalentPoolItem] = useMoveTalentPoolItemMutation();
    const [createTalentPool, { isLoading: isCreatingPool }] = useCreateTalentPoolMutation();

    const candidateId = appResponse?.data?.resumeDetail?.candidateId;
    const app = normalizeApplicationDetail(appResponse?.data);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setDebouncedCompareSearch(compareSearch.trim());
        }, 250);

        return () => window.clearTimeout(timer);
    }, [compareSearch]);

    const compareQueryParams = useMemo(() => ({
        jobId: app?.jobId,
        page: 0,
        size: 500,
        sortBy: 'AI_SCORE',
        ...(debouncedCompareSearch ? { keyword: debouncedCompareSearch } : {}),
        ...(compareMinScore > 0 ? { minScore: compareMinScore } : {}),
    }), [app?.jobId, compareMinScore, debouncedCompareSearch]);

    const { data: compareCandidatesResponse, isLoading: isCompareCandidatesLoading } = useGetApplicationsQuery(
        compareQueryParams,
        { skip: !app?.jobId }
    );

    const compareCandidates = useMemo(() => {
        const keyword = debouncedCompareSearch.toLowerCase();
        const candidates = (compareCandidatesResponse?.data?.content || [])
            .filter((application) => application.applicationId !== app?.applicationId)
            .filter((application) => {
                if (!keyword) return true;

                const candidateName = application?.candidateName?.toLowerCase() || '';
                const candidateEmail = application?.candidateEmail?.toLowerCase() || '';

                return candidateName.includes(keyword) || candidateEmail.includes(keyword);
            })
            .filter((application) => {
                if (compareMinScore <= 0) return true;

                const aiScore = getApplicationAiScore(application);
                return typeof aiScore === 'number' && aiScore >= compareMinScore;
            });

        return [...candidates].sort(sortCompareCandidates);
    }, [app?.applicationId, compareCandidatesResponse?.data?.content, compareMinScore, debouncedCompareSearch]);

    const currentEvaluation = useMemo(() => ({
        id: app?.evaluationId,
        aiScore: app?.aiScore,
        recruiterScore: app?.recruiterScore,
    }), [app?.aiScore, app?.evaluationId, app?.recruiterScore]);

    useEffect(() => {
        if (app?.status === 'APPLIED') {
            updateStatus({ id, status: 'VIEWED' }).unwrap().catch((error) => {
                console.error('Failed to auto-update status to VIEWED', error);
            });
        }
    }, [app?.status, id, updateStatus]);

    if (isLoading) return <Loading className="py-16" />;

    if (!app) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-gray-500">Application not found.</p>
            </div>
        );
    }

    const handleStatusSelect = (newStatus) => {
        if (newStatus === 'REJECTED') {
            setIsRejectModalOpen(true);
            return;
        }
        if (newStatus === 'APPROVED') {
            setIsApproveModalOpen(true);
            return;
        }
        doUpdateStatus(newStatus);
    };

    const doUpdateStatus = async (status, reason = null, showReason = false) => {
        try {
            await updateStatus({
                id,
                status,
                rejectReason: reason,
                showToCandidate: showReason,
            }).unwrap();
            toastMessage.success(`Status updated to ${APPLICATION_STATUS[status]?.label || status}`);
            setIsRejectModalOpen(false);
            setIsApproveModalOpen(false);
            setRejectReason('');
            setShowToCandidate(false);
        } catch (error) {
            toastMessage.error(error?.data?.message || 'Failed to update status');
        }
    };

    const handleBlock = async () => {
        if (!blockReason.trim()) {
            return toastMessage.warning('Please provide a reason for blocking');
        }
        try {
            await blockCandidate({
                candidateId,
                reason: blockReason,
            }).unwrap();
            toastMessage.success('Candidate has been blacklisted successfully');
            setIsBlockModalOpen(false);
            navigate(-1);
        } catch (error) {
            toastMessage.error(error?.data?.message || 'Failed to block candidate');
        }
    };

    const currentPoolInfo = app?.poolInfo;

    const handleAddToPool = async (poolId) => {
        try {
            if (currentPoolInfo?.poolItemId && currentPoolInfo?.id && String(currentPoolInfo.id) !== String(poolId)) {
                await moveTalentPoolItem({ id: currentPoolInfo.poolItemId, groupId: poolId }).unwrap();
                toastMessage.success('Candidate moved to new talent pool');
            } else {
                await addTalentPoolItem({ applicationId: id, groupId: poolId }).unwrap();
                toastMessage.success('Candidate added to talent pool');
            }
            setIsPoolModalOpen(false);
            await refetch();
        } catch (error) {
            toastMessage.error(error?.data?.message || 'Failed to update talent pool');
        }
    };

    const handleCreatePool = async (name, color) => {
        try {
            await createTalentPool({ name, color }).unwrap();
            toastMessage.success('Talent pool created successfully');
            setIsCreatePoolOpen(false);
        } catch (error) {
            toastMessage.error(error?.data?.message || 'Failed to create talent pool');
        }
    };

    const hasAi = app.aiEvaluation?.aiOverallScore != null;
    const hasCover = !!app.coverLetter;

    const tabs = [
        { key: TAB_KEYS.BASIC, label: 'Basic Information', icon: faUser },
        ...(hasAi ? [{ key: TAB_KEYS.AI, label: 'AI Analysis', lucideIcon: Sparkles }] : []),
        ...(hasCover ? [{ key: TAB_KEYS.COVER, label: 'Cover Letter', icon: faNewspaper }] : []),
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case TAB_KEYS.AI:
                return <AiAnalysis aiEvaluation={app.aiEvaluation} />;
            case TAB_KEYS.COVER:
                return <CoverLetter coverLetter={app.coverLetter} />;
            case TAB_KEYS.BASIC:
            default:
                return (
                    <BasicInformation
                        app={app}
                        onSwitchToAiTab={hasAi ? () => setActiveTab(TAB_KEYS.AI) : undefined}
                    />
                );
        }
    };

    const comparePopoverContent = (
        <div className="w-[360px] space-y-4" onClick={(event) => event.stopPropagation()}>
            <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4 dark:border-orange-900/30 dark:bg-orange-900/10">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-500">Current Application</p>
                        <p className="mt-1 truncate text-sm font-semibold text-gray-900 dark:text-white">{app.candidateName}</p>
                        <p className="mt-1 truncate text-xs text-gray-500 dark:text-neutral-400">{app.candidateEmail || 'No email available'}</p>
                    </div>
                    <div className="shrink-0 text-right">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-500">AI Score</p>
                        <p className="mt-1 text-lg font-bold text-orange-600 dark:text-orange-300">{formatScore(app.aiScore)}</p>
                        {app.recruiterScore != null && (
                            <div className="mt-1 flex justify-end">
                                <ManualScoreBadge evaluation={currentEvaluation} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Input
                allowClear
                value={compareSearch}
                onChange={(event) => setCompareSearch(event.target.value)}
                placeholder="Filter by candidate name or email"
                prefix={<Search size={14} className="text-gray-400" />}
                className="rounded-xl"
            />

            <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-neutral-400">
                        Min AI Score
                    </span>
                    {compareMinScore > 0 && (
                        <button
                            type="button"
                            onClick={() => setCompareMinScore(0)}
                            className="text-xs font-medium text-orange-500 transition-colors hover:text-orange-600"
                        >
                            Clear
                        </button>
                    )}
                </div>
                <Slider
                    min={0}
                    max={100}
                    value={compareMinScore}
                    onChange={setCompareMinScore}
                    tooltip={{ formatter: (value) => `${value}%` }}
                    trackStyle={{ backgroundColor: '#f97316' }}
                    handleStyle={{ borderColor: '#f97316' }}
                    className="mt-2 mb-1"
                />
                <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-neutral-500">
                    <span>0%</span>
                    <span className="font-semibold text-orange-500">{compareMinScore}%</span>
                    <span>100%</span>
                </div>
            </div>

            <div>
                <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-neutral-400">
                        Other Applications
                    </p>
                    <p className="text-xs text-gray-400 dark:text-neutral-500">
                        {isCompareCandidatesLoading ? 'Loading...' : `${compareCandidates.length} results`}
                    </p>
                </div>

                <div className="max-h-80 space-y-2 overflow-y-auto pr-1 scrollbar-thin">
                    {isCompareCandidatesLoading ? (
                        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500 dark:border-neutral-700 dark:bg-neutral-800/40 dark:text-neutral-400">
                            Loading applications...
                        </div>
                    ) : compareCandidates.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500 dark:border-neutral-700 dark:bg-neutral-800/40 dark:text-neutral-400">
                            No applications match the current filters.
                        </div>
                    ) : (
                        compareCandidates.map((application) => {
                            const availability = getCompareAvailability(application);
                            const aiScore = getApplicationAiScore(application);
                            const isManualScore = application?.evaluation?.recruiterScore != null;

                            return (
                                <button
                                    key={application.applicationId}
                                    type="button"
                                    disabled={!availability.enabled}
                                    onClick={() => navigate(`/applications/compare?left=${app.applicationId}&right=${application.applicationId}`)}
                                    className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                                        availability.enabled
                                            ? 'border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50/40 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-orange-500/40 dark:hover:bg-orange-900/10'
                                            : 'cursor-not-allowed border-gray-200 bg-gray-50/80 opacity-80 dark:border-neutral-800 dark:bg-neutral-900/50'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                                                    {application.candidateName}
                                                </p>
                                                {isManualScore && <ManualScoreBadge evaluation={application.evaluation} />}
                                            </div>
                                            <p className="mt-1 truncate text-xs text-gray-500 dark:text-neutral-400">
                                                {application.candidateEmail || 'No email available'}
                                            </p>
                                            {!availability.enabled && (
                                                <p className="mt-2 text-xs text-gray-500 dark:text-neutral-400">
                                                    {availability.helperText}
                                                </p>
                                            )}
                                        </div>
                                        <div className="shrink-0 text-right">
                                            <span className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${availability.badgeClassName}`}>
                                                {availability.label}
                                            </span>
                                            <p className="mt-2 text-sm font-bold text-gray-800 dark:text-neutral-100">
                                                {formatScore(aiScore)}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );

    const compareControl = (
        <Popover
            trigger="click"
            placement="bottomRight"
            content={comparePopoverContent}
            destroyTooltipOnHide
        >
            <button
                type="button"
                disabled={!app?.jobId}
                className="flex h-6 w-6 items-center justify-center rounded-full border border-sky-200 bg-sky-50 text-sky-500 transition-all duration-300 hover:bg-sky-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-sky-900/50 dark:bg-sky-900/20"
            >
                <GitCompareArrows size={11} strokeWidth={2.5} />
            </button>
        </Popover>
    );

    return (
        <div className="w-full space-y-4">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-sm overflow-clip flex flex-col" style={{ height: 'calc(100vh - 20px)' }}>
                <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-neutral-800">
                    <div className="flex gap-1 bg-gray-100 dark:bg-neutral-800 rounded-full p-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-full transition-colors duration-150 ${
                                    activeTab === tab.key
                                        ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-white'
                                        : 'text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                                }`}
                            >
                                {tab.lucideIcon ? <tab.lucideIcon size={14} /> : <FontAwesomeIcon icon={tab.icon} className="text-sm" />}
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        {(() => {
                            const allowedStatuses = getAllowedNextStatuses(app.status, app.isRejectedByAi);
                            if (allowedStatuses.length === 0) return null;
                            const statusOptions = [
                                { value: app.status, label: APPLICATION_STATUS[app.status]?.label || app.status, disabled: true },
                                ...allowedStatuses.map((key) => ({
                                    value: key,
                                    label: APPLICATION_STATUS[key]?.label || key,
                                })),
                            ];
                            return (
                                <ConfigProvider theme={{ token: { colorPrimary: '#f97316', colorBorderHover: '#f97316' } }}>
                                    <Select
                                        placeholder="Change status..."
                                        onChange={handleStatusSelect}
                                        loading={isUpdating}
                                        className="w-36 h-8"
                                        options={statusOptions}
                                        size="small"
                                        value={app.status}
                                    />
                                </ConfigProvider>
                            );
                        })()}
                        <CandidateHeader
                            app={app}
                            compareControl={compareControl}
                            onOpenBlock={() => setIsBlockModalOpen(true)}
                            onOpenAddToPool={() => setIsPoolModalOpen(true)}
                            compact
                        />
                    </div>
                </div>

                <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
                    <div className="w-full lg:w-1/2 lg:border-r border-gray-200 dark:border-neutral-800 overflow-y-auto overflow-x-hidden scrollbar-thin">
                        <div className="p-5">
                            {renderTabContent()}
                        </div>
                    </div>

                    {app.resumeUrl && (
                        <div className="w-full lg:w-1/2 overflow-hidden">
                            <PdfViewer
                                resumeUrl={app.resumeUrl}
                                resumeName={app.resumeName}
                                candidateName={app.candidateName}
                            />
                        </div>
                    )}
                </div>
            </div>

            <Modal
                open={isBlockModalOpen}
                title="Block Candidate"
                onCancel={() => setIsBlockModalOpen(false)}
                onSubmit={handleBlock}
                loading={isBlocking}
                loadingText="Blocking..."
                submitText="Confirm Block"
                danger={true}
                width={550}
            >
                <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
                        <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-600 text-[28px]" />
                        <div>
                            <p className="text-sm font-bold text-red-900">Important Warning</p>
                            <p className="text-xs text-red-700 leading-relaxed mt-1">
                                Blacklisting <strong>{app.candidateName}</strong> will prevent them from applying to any future jobs in your company.
                            </p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Reason for blocking <span className="text-red-500">*</span></label>
                        <Input.TextArea
                            placeholder="Enter the reason..."
                            rows={4}
                            className="rounded-xl border-gray-200 focus:ring-red-500 focus:border-red-500"
                            value={blockReason}
                            onChange={(event) => setBlockReason(event.target.value)}
                        />
                    </div>
                </div>
            </Modal>

            <Modal
                open={isRejectModalOpen}
                title="Reject Candidate"
                onCancel={() => {
                    setIsRejectModalOpen(false);
                    setRejectReason('');
                    setShowToCandidate(false);
                }}
                onSubmit={() => doUpdateStatus('REJECTED', rejectReason, showToCandidate)}
                loading={isUpdating}
                loadingText="Rejecting..."
                submitText="Confirm & Reject"
                danger
                width={500}
            >
                <div className="text-left space-y-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Are you sure you want to reject <strong>{app.candidateName}</strong>? Please state the reason.
                    </p>
                    <div className="space-y-3">
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
                            onChange={(event) => setRejectReason(event.target.value)}
                            className="w-full p-4 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 transition-all resize-none font-body"
                        />
                        <div className="flex items-center gap-2 px-1">
                            <Checkbox
                                id="showRejectReason"
                                checked={showToCandidate}
                                onChange={(event) => setShowToCandidate(event.target.checked)}
                            />
                            <label htmlFor="showRejectReason" className="text-sm text-neutral-600 dark:text-neutral-400 cursor-pointer select-none">
                                Allow candidate to see this rejection reason
                            </label>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal
                open={isApproveModalOpen}
                title="Approve Candidate"
                onCancel={() => setIsApproveModalOpen(false)}
                onSubmit={() => doUpdateStatus('APPROVED')}
                loading={isUpdating}
                loadingText="Approving..."
                submitText="Confirm & Approve"
                width={450}
            >
                <div className="text-left space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                        <FontAwesomeIcon icon={faCircleCheck} className="text-green-600 text-[28px]" />
                        <div>
                            <p className="text-sm font-bold text-green-900">Confirm Approval</p>
                            <p className="text-xs text-green-700 leading-relaxed mt-1">
                                You are about to approve <strong>{app.candidateName}</strong>. This action cannot be undone.
                            </p>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal
                open={isPoolModalOpen}
                title="Add to Talent Pool"
                onCancel={() => setIsPoolModalOpen(false)}
                submitText="null"
                footer={null}
                width={400}
            >
                <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-3.5 pb-2 p-1">
                    {pools.length === 0 ? (
                        <div className="text-center py-6 bg-neutral-50 dark:bg-neutral-800 rounded-xl space-y-3">
                            <p className="text-gray-500 text-sm">No talent pools found.</p>
                        </div>
                    ) : (
                        pools.map((pool) => {
                            const isCurrent = currentPoolInfo?.id != null && String(pool.id) === String(currentPoolInfo.id);
                            return (
                                <button
                                    key={pool.id}
                                    onClick={() => handleAddToPool(pool.id)}
                                    disabled={isAddingToPool || isCurrent}
                                    className={`w-full text-left px-4 py-3 bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-100 dark:border-neutral-700 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:border-orange-200 dark:hover:border-orange-500/30 transition-all flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed ${isCurrent ? 'ring-2 ring-inset ring-orange-500/50' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-3.5 h-3.5 rounded-full ring-2 ring-white dark:ring-neutral-900 shadow-sm" style={{ backgroundColor: pool.color || '#ccc' }} />
                                        <span className="font-medium text-sm text-neutral-800 dark:text-neutral-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                            {pool.name}
                                            {isCurrent && <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-orange-500">(Current)</span>}
                                        </span>
                                    </div>
                                    {isCurrent && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                                </button>
                            );
                        })
                    )}

                    <button
                        onClick={() => setIsCreatePoolOpen(true)}
                        className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-neutral-900 border border-dashed border-gray-300 dark:border-gray-600 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-gray-500 hover:text-orange-600 rounded-xl transition-all"
                    >
                        <Plus size={16} />
                        <span className="text-sm font-medium">Create new pool</span>
                    </button>
                </div>
            </Modal>

            <CreatePoolModal
                open={isCreatePoolOpen}
                onCancel={() => setIsCreatePoolOpen(false)}
                onCreate={handleCreatePool}
                isCreating={isCreatingPool}
            />
        </div>
    );
};

export default ApplicationDetail;
