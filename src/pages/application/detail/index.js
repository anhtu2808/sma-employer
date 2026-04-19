import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Checkbox } from 'antd';
import toastMessage from '@/utils/toastMessage';
import { useGetApplicationDetailQuery, useUpdateApplicationStatusMutation } from '@/apis/applicationApi';
import { useGetTalentPoolsQuery, useAddTalentPoolItemMutation, useCreateTalentPoolMutation } from '@/apis/talentPoolApi';
import { APPLICATION_STATUS } from '@/constrant/application';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import { useBlockCandidateMutation } from '@/apis/companyApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser, faNewspaper,
    faTriangleExclamation, faCircleCheck,
} from '../../../utils/icons';
import { Sparkles } from 'lucide-react';
import { Select, ConfigProvider } from 'antd';
import { getAllowedNextStatuses } from '@/constrant/application';
import CandidateHeader from './candidate-header';
import BasicInformation from './basic-information';
import AiAnalysis from './ai-analysis';
import CoverLetter from './cover-letter';
import PdfViewer from './pdf-viewer';
import CreatePoolModal from '../../talent-pool/create-pool-modal';
import { Plus } from 'lucide-react';

const normalizeApplicationDetail = (payload) => {
    if (!payload) return null;

    const info = payload.applicationInfo || {};
    const resume = payload.resumeDetail || {};
    const ai = payload.aiEvaluation || {};

    return {
        status: info.status,
        attempt: info.attempt,
        candidateName: info.fullName,
        candidateEmail: info.email,
        candidatePhone: info.phone,
        jobTitle: info.jobTitle,
        coverLetter: info.coverLetter,
        appliedAt: info.appliedAt,
        resumeId: resume.id,
        resumeUrl: resume.resumeUrl,
        resumeName: info.resumeName,
        location: resume.addressInResume,
        githubLink: resume.githubLink,
        linkedinLink: resume.linkedinLink,
        portfolioLink: resume.portfolioLink,
        answers: (info.answers || []).map((a) => ({
            question: a.questionText,
            answer: a.answerContent,
        })),
        aiScore: ai.aiOverallScore,
        recruiterScore: ai.recruiterOverallScore,
        evaluationId: ai.id,
        aiEvaluation: payload.aiEvaluation || null,
        source: payload.source,
        rejectReason: info.rejectReason,
        showRejectReason: info.showRejectReason,
        reviewedAt: info.reviewedAt,
        reviewedByEmail: info.reviewedByEmail,
        isRejectedByAi: info.isRejectedByAi,
    };
};

const TAB_KEYS = {
    BASIC: 'basic',
    AI: 'ai',
    COVER: 'cover',
};

const ApplicationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: appResponse, isLoading } = useGetApplicationDetailQuery(id, { skip: !id });
    const [updateStatus, { isLoading: isUpdating }] = useUpdateApplicationStatusMutation();
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [blockReason, setBlockReason] = useState('');
    const [blockCandidate, { isLoading: isBlocking }] = useBlockCandidateMutation();
    const [activeTab, setActiveTab] = useState(TAB_KEYS.BASIC);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [showToCandidate, setShowToCandidate] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    
    // Talent Pool Logic
    const [isPoolModalOpen, setIsPoolModalOpen] = useState(false);
    const [isCreatePoolOpen, setIsCreatePoolOpen] = useState(false);
    const { data: poolsResponse } = useGetTalentPoolsQuery();
    const pools = poolsResponse?.data || [];
    const [addTalentPoolItem, { isLoading: isAddingToPool }] = useAddTalentPoolItemMutation();
    const [createTalentPool, { isLoading: isCreatingPool }] = useCreateTalentPoolMutation();

    const candidateId = appResponse?.data?.resumeDetail?.candidateId;

    const app = normalizeApplicationDetail(appResponse?.data);

    useEffect(() => {
        if (app?.status === 'APPLIED') {
            updateStatus({ id, status: 'VIEWED' }).unwrap().catch(err => {
                console.error("Failed to auto-update status to VIEWED", err);
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
                id, status, rejectReason: reason,
                showToCandidate: showReason
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
                candidateId: candidateId,
                reason: blockReason
            }).unwrap();
            toastMessage.success('Candidate has been blacklisted successfully');
            setIsBlockModalOpen(false);
            navigate(-1);
        } catch (error) {
            toastMessage.error(error?.data?.message || 'Failed to block candidate');
        }
    };

    const handleAddToPool = async (poolId) => {
        try {
            await addTalentPoolItem({ applicationId: id, groupId: poolId }).unwrap();
            toastMessage.success('Candidate added to talent pool');
            setIsPoolModalOpen(false);
        } catch (error) {
            toastMessage.error(error?.data?.message || 'Failed to add to talent pool');
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

    const hasAi = !!app.aiEvaluation?.aiOverallScore;
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

    return (
        <div className="w-full space-y-4">
            {/* Unified Card */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-sm overflow-clip" style={{ height: 'calc(100vh - 20px)' }}>
                {/* Tabs Bar — full width at top */}
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex gap-1 bg-gray-100 dark:bg-neutral-800 rounded-full p-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-full transition-colors duration-150 ${activeTab === tab.key
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
                            onOpenBlock={() => setIsBlockModalOpen(true)}
                            onOpenAddToPool={() => setIsPoolModalOpen(true)}
                            compact
                        />
                    </div>
                </div>

                {/* Content: Left info + Right PDF */}
                <div className="flex flex-col lg:flex-row h-[calc(100%-42px)]">
                    {/* Left: Tab Content */}
                    <div className="w-full lg:w-1/2 lg:border-r border-gray-200 dark:border-neutral-800 overflow-y-auto overflow-x-hidden scrollbar-thin">
                        <div className="p-5">
                            {renderTabContent()}
                        </div>
                    </div>

                    {/* Right: PDF Viewer */}
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

            {/* Block Modal */}
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
                            onChange={(e) => setBlockReason(e.target.value)}
                        />
                    </div>
                </div>
            </Modal>

            {/* Reject Modal */}
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
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="w-full p-4 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 transition-all resize-none font-body"
                        />
                        <div className="flex items-center gap-2 px-1">
                            <Checkbox
                                id="showRejectReason"
                                checked={showToCandidate}
                                onChange={(e) => setShowToCandidate(e.target.checked)}
                            />
                            <label htmlFor="showRejectReason" className="text-sm text-neutral-600 dark:text-neutral-400 cursor-pointer select-none">
                                Allow candidate to see this rejection reason
                            </label>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Approve Modal */}
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

            {/* Add to Talent Pool Modal */}
            <Modal
                open={isPoolModalOpen}
                title="Add to Talent Pool"
                onCancel={() => setIsPoolModalOpen(false)}
                submitText="null"
                footer={null}
                width={400}
            >
                <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2 pb-2">
                    {pools.length === 0 ? (
                        <div className="text-center py-6 bg-neutral-50 dark:bg-neutral-800 rounded-xl space-y-3">
                            <p className="text-gray-500 text-sm">No talent pools found.</p>
                        </div>
                    ) : (
                        pools.map(pool => (
                            <button
                                key={pool.id}
                                onClick={() => handleAddToPool(pool.id)}
                                disabled={isAddingToPool}
                                className="w-full text-left px-4 py-3 bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-100 dark:border-neutral-700 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:border-orange-200 dark:hover:border-orange-500/30 transition-all flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-3.5 h-3.5 rounded-full ring-2 ring-white dark:ring-neutral-900 shadow-sm" style={{ backgroundColor: pool.color || '#ccc' }}></div>
                                    <span className="font-medium text-sm text-neutral-800 dark:text-neutral-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{pool.name}</span>
                                </div>
                            </button>
                        ))
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

            {/* Create Pool Modal */}
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
