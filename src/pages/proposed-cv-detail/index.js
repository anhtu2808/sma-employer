import React from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useGetProposedCvDetailQuery } from '@/apis/jobApi';
import Loading from '@/components/Loading';
import Overview from './Overview';
import PdfViewer from '@/pages/application/detail/pdf-viewer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '../../utils/icons';

const ProposedCVDetail = () => {
    const { jobId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const proposedResumeIdParam = searchParams.get('proposedResumeId');
    const numericProposedResumeId = Number(proposedResumeIdParam);
    const hasValidProposedResumeId = Number.isInteger(numericProposedResumeId) && numericProposedResumeId > 0;
    const { data: response, isLoading, error } = useGetProposedCvDetailQuery(numericProposedResumeId, {
        skip: !hasValidProposedResumeId,
    });

    const cvData = response?.data;
    const errorMessage = error?.data?.message || 'Proposed CV not found or unavailable.';

    if (isLoading) return <Loading className="py-16" />;

    if (!hasValidProposedResumeId) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="text-gray-500 mb-4 text-center max-w-md">
                    Missing proposed resume id. Please reopen this profile from the proposed CV list.
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
                <p className="text-gray-500 mb-4 text-center max-w-md">{errorMessage}</p>
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

            <Overview cvData={cvData} proposedResumeId={numericProposedResumeId} />

            <div className="grid grid-cols-1 xl:grid-cols-[460px_minmax(0,1fr)] gap-6 items-start">
                <div className="space-y-4 xl:sticky xl:top-5">
                    <InsightCard
                        title="Summary"
                        content={cvData.summary}
                        tone="orange"
                    />
                    <InsightCard
                        title="Strengths"
                        content={cvData.strengths}
                        tone="emerald"
                    />
                    <InsightCard
                        title="Weakness"
                        content={cvData.weakness}
                        tone="rose"
                    />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden min-h-[720px]">
                    {cvData.resume_url ? (
                        <PdfViewer
                            resumeUrl={cvData.resume_url}
                            resumeName={cvData.file_name || cvData.resume_name}
                            candidateName={cvData.full_name || cvData.resume_name}
                        />
                    ) : (
                        <div className="h-full min-h-[720px] flex items-center justify-center px-6 text-center text-sm text-gray-500 dark:text-gray-400">
                            CV preview is not available for this proposed candidate.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const InsightCard = ({ title, content, tone }) => {
    const toneClass = tone === 'emerald'
        ? 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/30'
        : tone === 'rose'
            ? 'border-rose-200 bg-rose-50/60 dark:border-rose-900 dark:bg-rose-950/30'
            : 'border-orange-200 bg-orange-50/60 dark:border-orange-900 dark:bg-orange-950/30';

    return (
        <section className={`rounded-2xl border shadow-sm p-6 ${toneClass}`}>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
            <div className="text-[15px] leading-8 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                <InsightContent content={content} />
            </div>
        </section>
    );
};

const InsightContent = ({ content }) => {
    const normalized = normalizeInsightContent(content);

    if (!normalized) {
        return 'Not available yet.';
    }

    const lines = normalized
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

    if (lines.some((line) => line.startsWith('- '))) {
        return (
            <div className="space-y-2.5">
                {lines.map((line, index) => (
                    <p key={`${line}-${index}`}>{line}</p>
                ))}
            </div>
        );
    }

    return normalized;
};

const normalizeInsightContent = (content) => {
    if (!content) return '';

    return String(content)
        .replace(/<\/?(ul|ol)>/gi, '')
        .replace(/<li>/gi, '- ')
        .replace(/<\/li>/gi, '\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
};

export default ProposedCVDetail;
