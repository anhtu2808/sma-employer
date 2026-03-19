import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetResumeDetailQuery } from '@/apis/jobApi';
import Loading from '@/components/Loading';
import Overview from './Overview';
import PdfResume from '@/pages/application/detail/pdf-resume';

const ProposedCVDetail = () => {
    const { jobId, resumeId } = useParams();
    const navigate = useNavigate();
    const { data: response, isLoading } = useGetResumeDetailQuery(resumeId, { skip: !resumeId });

    const cvData = response?.data;

    if (isLoading) return <Loading className="py-16" />;

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
                <span className="material-icons-round text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                <span className="font-medium">Back to Job pipeline</span>
            </button>

            <Overview cvData={cvData} />

            {cvData.resumeUrl && (
                <PdfResume 
                    resumeUrl={cvData.resumeUrl} 
                    resumeName={cvData.fileName || cvData.resumeName} 
                    candidateName={cvData.resumeName} 
                />
            )}
        </div>
    );
};

export default ProposedCVDetail;
