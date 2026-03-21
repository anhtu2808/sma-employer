import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message, Input, Checkbox } from 'antd';
import { useGetApplicationDetailQuery, useUpdateApplicationStatusMutation } from '@/apis/applicationApi';
import { APPLICATION_STATUS } from '@/constrant/application';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import { useBlockCandidateMutation } from '@/apis/companyApi';
import CandidateHeader from './candidate-header';
import Overview from './overview';
import AiAnalysis from './ai-analysis';
import Answers from './answers';
import CoverLetter from './cover-letter';
import PdfViewer from './pdf-viewer';

const normalizeApplicationDetail = (payload) => {
    if (!payload) return null;

    const info = payload.applicationInfo || {};
    const resume = payload.resumeDetail || {};
    const ai = payload.aiEvaluation || {};

    return {
        status: info.status,
        candidateName: info.fullName,
        candidateEmail: info.email,
        candidatePhone: info.phone,
        jobTitle: info.jobTitle,
        coverLetter: info.coverLetter,
        appliedAt: info.appliedAt,
        resumeUrl: resume.resumeUrl,
        resumeName: info.resumeName,
        location: resume.addressInResume,
        answers: (info.answers || []).map((a) => ({
            question: a.questionText,
            answer: a.answerContent,
        })),
        aiScore: ai.aiOverallScore,
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
    OVERVIEW: 'overview',
    AI: 'ai',
    QA: 'qa',
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
    const [activeTab, setActiveTab] = useState(TAB_KEYS.OVERVIEW);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [showToCandidate, setShowToCandidate] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
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
            message.success(`Status updated to ${APPLICATION_STATUS[status]?.label || status}`);
            setIsRejectModalOpen(false);
            setIsApproveModalOpen(false);
            setRejectReason('');
            setShowToCandidate(false);
        } catch (error) {
            message.error(error?.data?.message || 'Failed to update status');
        }
    };

    const handleBlock = async () => {
        if (!blockReason.trim()) {
            return message.warning('Please provide a reason for blocking');
        }
        try {
            await blockCandidate({
                candidateId: candidateId,
                reason: blockReason
            }).unwrap();
            message.success('Candidate has been blacklisted successfully');
            setIsBlockModalOpen(false);
            navigate(-1);
        } catch (error) {
            message.error(error?.data?.message || 'Failed to block candidate');
        }
    };

    const hasAi = !!app.aiEvaluation?.aiOverallScore;
    const hasAnswers = app.answers?.length > 0;
    const hasCover = !!app.coverLetter;

    const tabs = [
        { key: TAB_KEYS.OVERVIEW, label: 'Overview', icon: 'person' },
        ...(hasAi ? [{ key: TAB_KEYS.AI, label: 'AI Analysis', icon: 'psychology' }] : []),
        ...(hasAnswers ? [{ key: TAB_KEYS.QA, label: 'Q&A', icon: 'quiz' }] : []),
        ...(hasCover ? [{ key: TAB_KEYS.COVER, label: 'Cover Letter', icon: 'article' }] : []),
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case TAB_KEYS.AI:
                return <AiAnalysis aiEvaluation={app.aiEvaluation} />;
            case TAB_KEYS.QA:
                return <Answers answers={app.answers} />;
            case TAB_KEYS.COVER:
                return <CoverLetter coverLetter={app.coverLetter} />;
            case TAB_KEYS.OVERVIEW:
            default:
                return (
                    <Overview
                        app={app}
                        onSwitchToAiTab={hasAi ? () => setActiveTab(TAB_KEYS.AI) : undefined}
                        onStatusChange={handleStatusSelect}
                        isUpdating={isUpdating}
                        isRejectedByAi={app.isRejectedByAi}
                    />
                );
        }
    };

    return (
        <div className="w-full space-y-4">
            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors group"
            >
                <span className="material-icons-round text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                <span className="font-medium">Back to Pipeline</span>
            </button>

            {/* Split Panel Layout */}
            <div className="flex flex-col lg:flex-row gap-4" style={{ minHeight: 'calc(100vh - 140px)' }}>
                {/* Left: PDF Viewer */}
                {app.resumeUrl && (
                    <div className="w-full lg:w-[70%] shrink-0 h-[50vh] lg:h-auto lg:sticky lg:top-4 lg:self-start" style={{ maxHeight: 'calc(100vh - 100px)' }}>
                        <PdfViewer
                            resumeUrl={app.resumeUrl}
                            resumeName={app.resumeName}
                            candidateName={app.candidateName}
                        />
                    </div>
                )}

                {/* Right: Info Panel */}
                <div className={`flex-1 min-w-0 ${!app.resumeUrl ? 'max-w-3xl mx-auto w-full' : ''}`}>
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-sm overflow-hidden">
                        {/* Candidate Header */}
                        <div className="px-5 pt-5 pb-0">
                            <CandidateHeader
                                app={app}
                                onOpenBlock={() => setIsBlockModalOpen(true)}
                            />
                        </div>

                        {/* Tabs */}
                        <div className="px-5 pt-3">
                            <div className="flex gap-1 border-b border-gray-100 dark:border-neutral-800">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                                            activeTab === tab.key
                                                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                                        }`}
                                    >
                                        <span className="material-icons-round text-base">{tab.icon}</span>
                                        <span className="hidden sm:inline">{tab.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="p-5">
                            {renderTabContent()}
                        </div>
                    </div>
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
                        <span className="material-symbols-outlined text-red-600 text-[28px]">warning</span>
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
                        <span className="material-symbols-outlined text-green-600 text-[28px]">check_circle</span>
                        <div>
                            <p className="text-sm font-bold text-green-900">Confirm Approval</p>
                            <p className="text-xs text-green-700 leading-relaxed mt-1">
                                You are about to approve <strong>{app.candidateName}</strong>. This action cannot be undone.
                            </p>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ApplicationDetail;
