import React, { useState } from 'react';
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


    if (isLoading) return <Loading className="py-16" />;

    const app = normalizeApplicationDetail(appResponse?.data);
    if (!app) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-gray-500">Application not found.</p>
            </div>
        );
    }

    const handleStatusChange = async (newStatus) => {
        try {
            await updateStatus({ id, status: newStatus }).unwrap();
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
