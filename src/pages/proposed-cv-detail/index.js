import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useGetProposedCvDetailQuery } from '@/apis/jobApi';
import Loading from '@/components/Loading';
import Overview from './Overview';
import PdfViewer from '@/pages/application/detail/pdf-viewer';
import BasicInformation from '@/pages/application/detail/basic-information';
import AiAnalysis from '@/pages/application/detail/ai-analysis';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '../../utils/icons';
import { Sparkles } from 'lucide-react';

const TAB_KEYS = {
    BASIC: 'basic',
    AI: 'ai',
};

const ProposedCVDetail = () => {
    const { jobId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(TAB_KEYS.BASIC);
    const proposedResumeIdParam = searchParams.get('proposedResumeId');
    const numericProposedResumeId = Number(proposedResumeIdParam);
    const hasValidProposedResumeId = Number.isInteger(numericProposedResumeId) && numericProposedResumeId > 0;
    const { data: response, isLoading, error } = useGetProposedCvDetailQuery(numericProposedResumeId, {
        skip: !hasValidProposedResumeId,
    });

    const cvData = response?.data;
    const proposedCv = normalizeProposedCvDetail(cvData);
    const errorMessage = error?.data?.message || 'Proposed CV not found or unavailable.';
    const hasAi = hasAiEvaluation(proposedCv?.aiEvaluation);
    const tabs = [
        { key: TAB_KEYS.BASIC, label: 'Basic Information' },
        ...(hasAi ? [{ key: TAB_KEYS.AI, label: 'AI Analysis', icon: Sparkles }] : []),
    ];

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

    if (!cvData || !proposedCv) {
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

    const proposalMetaItems = [
        proposedCv.proposalStatus && {
            label: 'Proposal Status',
            value: formatProposalStatus(proposedCv.proposalStatus),
        },
        proposedCv.proposedAt && {
            label: 'Proposed On',
            value: formatDateTime(proposedCv.proposedAt),
        },
        proposedCv.matchRate != null && {
            label: 'Match Rate',
            value: formatPercent(proposedCv.matchRate),
            valueClassName: `text-base font-semibold ${getMetricTextColor(proposedCv.matchRate)}`,
        },
        proposedCv.aiScore != null && {
            label: 'AI Score',
            value: formatPercent(proposedCv.aiScore),
            labelClassName: 'text-orange-400',
            valueClassName: 'text-sm font-bold text-orange-500 group-hover:text-orange-600',
            wrapperClassName: 'bg-orange-50 dark:bg-orange-900/10 hover:bg-orange-100 dark:hover:bg-orange-900/20',
            onClick: hasAi ? () => setActiveTab(TAB_KEYS.AI) : undefined,
        },
    ].filter(Boolean);

    const renderTabContent = () => {
        switch (activeTab) {
            case TAB_KEYS.AI:
                return hasAi ? <AiAnalysis aiEvaluation={proposedCv.aiEvaluation} /> : null;
            case TAB_KEYS.BASIC:
            default:
                return (
                    <BasicInformation
                        app={proposedCv}
                        onSwitchToAiTab={hasAi ? () => setActiveTab(TAB_KEYS.AI) : undefined}
                        metaTitle="Proposal Info"
                        metaItems={proposalMetaItems}
                        showDecisionHistory={false}
                    />
                );
        }
    };

    return (
        <div className="w-full space-y-4">
            <button
                onClick={() => navigate(`/jobs/${jobId}`)}
                className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors group"
            >
                <FontAwesomeIcon icon={faArrowLeft} className="text-lg group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Job pipeline</span>
            </button>

            <div
                className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col"
                style={{ height: 'calc(100vh - 20px)' }}
            >
                <div className="shrink-0 border-b border-gray-200 dark:border-neutral-800">
                    <Overview cvData={cvData} proposedResumeId={numericProposedResumeId} />
                </div>

                <div className="shrink-0 px-4 py-3 border-b border-gray-200 dark:border-neutral-800">
                    <div className="flex gap-1 bg-gray-100 dark:bg-neutral-800 rounded-full p-1 w-fit">
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
                                {tab.icon ? <tab.icon size={14} /> : null}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
                    <div className="w-full lg:w-1/2 lg:border-r border-gray-200 dark:border-neutral-800 overflow-y-auto overflow-x-hidden scrollbar-thin">
                        <div className="p-5">
                            {renderTabContent()}
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 overflow-hidden">
                        {proposedCv.resumeUrl ? (
                            <PdfViewer
                                resumeUrl={proposedCv.resumeUrl}
                                resumeName={proposedCv.resumeName}
                                candidateName={proposedCv.candidateName}
                            />
                        ) : (
                            <div className="h-full min-h-[720px] flex items-center justify-center px-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                CV preview is not available for this proposed candidate.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const normalizeProposedCvDetail = (payload) => {
    if (!payload) return null;

    const aiScore = normalizePercentNumber(payload.ai_overall_score);
    const matchRate = normalizePercentNumber(payload.match_rate);
    const hasAi = aiScore != null || payload.summary || payload.strengths || payload.weakness;

    return {
        candidateName: payload.full_name || payload.resume_name || payload.file_name || 'Unknown Candidate',
        candidateEmail: payload.email || null,
        candidatePhone: payload.phone || null,
        jobTitle: payload.job_title || 'N/A',
        location: payload.address || null,
        githubLink: payload.github_link || null,
        linkedinLink: payload.linkedin_link || null,
        portfolioLink: payload.portfolio_link || null,
        answers: [],
        aiScore,
        aiEvaluation: hasAi
            ? {
                aiOverallScore: aiScore ?? 0,
                summary: payload.summary || null,
                strengths: payload.strengths || null,
                weakness: payload.weakness || null,
                criteriaScores: [],
            }
            : null,
        resumeUrl: payload.resume_url || null,
        resumeName: payload.file_name || payload.resume_name || payload.full_name || 'Resume',
        proposalStatus: payload.status || null,
        proposedAt: payload.proposed_at || null,
        matchRate,
    };
};

const hasAiEvaluation = (evaluation) => (
    Boolean(
        evaluation
        && (
            evaluation.aiOverallScore != null
            || evaluation.summary
            || evaluation.strengths
            || evaluation.weakness
            || (Array.isArray(evaluation.criteriaScores) && evaluation.criteriaScores.length > 0)
        )
    )
);

const normalizePercentNumber = (value) => {
    if (value == null || Number.isNaN(Number(value))) return null;
    const numericValue = Number(value);
    return numericValue <= 1 && numericValue > 0
        ? Math.round(numericValue * 100)
        : Math.round(numericValue);
};

const formatPercent = (value) => {
    const normalizedValue = normalizePercentNumber(value);
    return normalizedValue == null ? '--' : `${normalizedValue}%`;
};

const formatDateTime = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleString();
};

const formatProposalStatus = (status) => {
    if (!status) return 'N/A';
    return String(status)
        .toLowerCase()
        .split('_')
        .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
        .join(' ');
};

const getMetricTextColor = (score) => {
    const normalizedScore = normalizePercentNumber(score);
    if (normalizedScore == null) return 'text-gray-500';
    if (normalizedScore >= 80) return 'text-emerald-600';
    if (normalizedScore >= 60) return 'text-orange-500';
    return 'text-red-500';
};

export default ProposedCVDetail;
