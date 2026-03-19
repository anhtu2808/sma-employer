import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message, Input } from 'antd';
import { useGetApplicationDetailQuery, useUpdateApplicationStatusMutation } from '@/apis/applicationApi';
import { APPLICATION_STATUS } from '@/constrant/application';
import Loading from '@/components/Loading';
import Overview from './overview';
import Answers from './answers';
import PdfResume from './pdf-resume';
import CoverLetter from './cover-letter';
import Modal from '@/components/Modal';
import { useBlockCandidateMutation } from '@/apis/companyApi';

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
        source: payload.source,
        rejectReason: info.rejectReason,
        showRejectReason: info.showRejectReason,
        reviewedAt: info.reviewedAt,
        reviewedByEmail: info.reviewedByEmail,
    };
};

const ApplicationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: appResponse, isLoading } = useGetApplicationDetailQuery(id, { skip: !id });
    const [updateStatus, { isLoading: isUpdating }] = useUpdateApplicationStatusMutation();
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [blockReason, setBlockReason] = useState('');
    const [blockCandidate, { isLoading: isBlocking }] = useBlockCandidateMutation();
    const candidateId = appResponse?.data?.resumeDetail?.candidateId;


    const app = normalizeApplicationDetail(appResponse?.data);

    // Auto update status from APPLIED to VIEWED when recruiter opens detail
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

    const handleStatusChange = async (newStatus, reason = null, showReason = false) => {
        try {
            await updateStatus({
                id, status: newStatus, rejectReason: reason,
                showToCandidate: showReason
            }).unwrap();
            message.success(`Status updated to ${APPLICATION_STATUS[newStatus]?.label || newStatus}`);
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

    return (
        <div className="w-full space-y-5">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors group"
            >
                <span className="material-icons-round text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                <span className="font-medium">Back to Pipeline</span>
            </button>

            <Overview
                app={app}
                onStatusChange={handleStatusChange}
                isUpdating={isUpdating}
                onOpenBlock={() => setIsBlockModalOpen(true)}
            />
            {(app.status === 'REJECTED' || app.status === 'APPROVED') && (
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[24px] p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <span className={`material-icons-round ${app.status === 'REJECTED' ? 'text-red-500' : 'text-green-500'}`}>
                            {app.status === 'REJECTED' ? 'cancel' : 'check_circle'}
                        </span>
                        <h3 className="font-bold text-gray-800 dark:text-neutral-200">
                            Decision History
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-gray-500 tracking-wider">Processed By</span>
                                <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">
                                    {app.reviewedByEmail || 'System / Auto'}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-gray-500 tracking-wider">Processed At</span>
                                <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">
                                    {app.reviewedAt ? new Date(app.reviewedAt).toLocaleString() : 'N/A'}
                                </span>
                            </div>
                        </div>

                        {app.status === 'REJECTED' && (
                            <div className="flex flex-col p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-red-600 uppercase">Rejection Reason</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${app.showRejectReason ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                        {app.showRejectReason ? 'Visible to Candidate' : 'Internal Only'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-neutral-400 italic">
                                    {app.rejectReason || "No reason provided."}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
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
            <Answers answers={app.answers} />
            <PdfResume resumeUrl={app.resumeUrl} resumeName={app.resumeName} candidateName={app.candidateName} />
            <CoverLetter coverLetter={app.coverLetter} />
        </div>
    );
};

export default ApplicationDetail;
