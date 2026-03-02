import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useGetApplicationDetailQuery, useUpdateApplicationStatusMutation } from '@/apis/applicationApi';
import { APPLICATION_STATUS } from '@/constrant/application';
import Loading from '@/components/Loading';
import Overview from './overview';
import Answers from './answers';
import PdfResume from './pdf-resume';
import CoverLetter from './cover-letter';

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

    return (
        <div className="w-full space-y-5">
            {/* Back Navigation */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors group"
            >
                <span className="material-icons-round text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                <span className="font-medium">Back to Pipeline</span>
            </button>

            <Overview app={app} onStatusChange={handleStatusChange} isUpdating={isUpdating} />
            <Answers answers={app.answers} />
            <PdfResume resumeUrl={app.resumeUrl} resumeName={app.resumeName} candidateName={app.candidateName} />
            <CoverLetter coverLetter={app.coverLetter} />
        </div>
    );
};

export default ApplicationDetail;
