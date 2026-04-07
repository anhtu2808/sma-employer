import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetResumeDetailQuery } from '@/apis/jobApi';
import Loading from '@/components/Loading';
import Overview from './Overview';
import PdfViewer from '@/pages/application/detail/pdf-viewer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '../../utils/icons';

const ProposedCVDetail = () => {
    const { jobId, resumeId } = useParams();
    const navigate = useNavigate();
    const numericResumeId = Number(resumeId);
    const hasValidResumeId = Number.isInteger(numericResumeId) && numericResumeId > 0;
    const { data: response, isLoading } = useGetResumeDetailQuery(numericResumeId, { skip: !hasValidResumeId });

    const cvData = response?.data;

    if (isLoading) return <Loading className="py-16" />;

    if (!hasValidResumeId) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="text-gray-500 mb-4 text-center max-w-md">
                    This proposed CV is still locked. Please unlock it from the proposed CV list before opening the full profile.
                </p>
                <button
                    onClick={() => navigate(`/jobs/${jobId}`)}
                    className="text-orange-500 hover:underline"
                >
                    Back to Job
                </button>
            </div>
        );
    }

    if (!cvData) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="text-gray-500 mb-4">Proposed CV not found or unavailable.</p>
                <button
                    onClick={() => navigate(`/jobs/${jobId}`)}
                    className="text-orange-500 hover:underline"
                >
                    Back to Job
                </button>
            </div>
        );
    }

    return (
        <div className="w-full space-y-5">
            <button
                onClick={() => navigate(`/jobs/${jobId}`)}
                className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors group"
            >
                <FontAwesomeIcon icon={faArrowLeft} className="text-lg group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Job pipeline</span>
            </button>

            <Overview cvData={cvData} />

            {cvData.resumeUrl && (
                <PdfViewer
                    resumeUrl={cvData.resumeUrl}
                    resumeName={cvData.fileName || cvData.resumeName}
                    candidateName={cvData.resumeName}
                />
            )}
        </div>
    );
};

export default ProposedCVDetail;
