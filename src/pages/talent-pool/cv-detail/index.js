import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetResumeDetailQuery } from '@/apis/jobApi';
import Loading from '@/components/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser } from '../../../utils/icons';
import { Sparkles } from 'lucide-react';
import PdfViewer from '@/pages/application/detail/pdf-viewer';
import BasicInformation from '@/pages/application/detail/basic-information';
import AiAnalysis from '@/pages/application/detail/ai-analysis';

const TAB_KEYS = {
    BASIC: 'basic',
    AI: 'ai',
};

const TalentPoolCvDetail = () => {
    const { resumeId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(TAB_KEYS.BASIC);

    const numericResumeId = Number(resumeId);
    const hasValidResumeId = Number.isInteger(numericResumeId) && numericResumeId > 0;

    const { data: response, isLoading, isError, error } = useGetResumeDetailQuery(numericResumeId, {
        skip: !hasValidResumeId,
    });

    const resumeData = response?.data;
    const errorMessage = error?.data?.message || 'Resume not found or unavailable.';

    if (isLoading) return <Loading className="py-16" />;

    if (!hasValidResumeId) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="text-gray-500 mb-4 text-center max-w-md">
                    Missing resume id. Please reopen this profile from the talent pool list.
                </p>
                <button
                    onClick={() => navigate('/talent-pool')}
                    className="text-orange-500 hover:underline"
                >
                    Back to Talent Pool
                </button>
            </div>
        );
    }

    if (isError || !resumeData) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="text-gray-500 mb-4 text-center max-w-md">{errorMessage}</p>
                <button
                    onClick={() => navigate('/talent-pool')}
                    className="text-orange-500 hover:underline"
                >
                    Back to Talent Pool
                </button>
            </div>
        );
    }

    const evaluation = resumeData.evaluations && resumeData.evaluations.length > 0 ? resumeData.evaluations[0] : null;

    // Normalize what we get from the resume to fit the `BasicInformation` expected `app` format
    const app = {
        candidateName: resumeData.fullName || resumeData.resumeName || resumeData.fileName || 'Candidate',
        jobTitle: resumeData.jobTitle || null,
        candidateEmail: resumeData.emailInResume || resumeData.email || null,
        candidatePhone: resumeData.phoneInResume || resumeData.phone || null,
        location: resumeData.addressInResume || resumeData.location || null,
        githubLink: resumeData.githubLink || null,
        linkedinLink: resumeData.linkedinLink || null,
        portfolioLink: resumeData.portfolioLink || null,
        resumeUrl: resumeData.resumeUrl || null,
        resumeName: resumeData.fileName || resumeData.resumeName || 'Resume.pdf',
        answers: [],
        aiEvaluation: evaluation ? {
            aiOverallScore: evaluation.aiOverallScore ?? 0,
            summary: evaluation.summary || null,
            strengths: evaluation.strengths || null,
            weakness: evaluation.weakness || null,
            criteriaScores: evaluation.criteriaScores || [],
        } : null,
        aiScore: evaluation ? Math.round(evaluation.aiOverallScore || 0) : null,
        status: null,
        attempt: null,
    };

    const hasAi = !!app.aiEvaluation;

    const tabs = [
        { key: TAB_KEYS.BASIC, label: 'Basic Information', icon: faUser },
        ...(hasAi ? [{ key: TAB_KEYS.AI, label: 'AI Analysis', lucideIcon: Sparkles }] : []),
    ];

    return (
        <div className="w-full space-y-4">
            {/* Unified Card */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-sm overflow-clip flex flex-col" style={{ height: 'calc(100vh - 20px)' }}>
                
                {/* Header Section */}
                <div className="shrink-0 px-5 pt-5 pb-3 border-b border-gray-200 dark:border-neutral-800">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                        {app.candidateName}
                    </h1>
                    <div className="flex items-center gap-3 mt-1 cursor-default text-sm text-gray-500 dark:text-gray-400">
                        {app.candidateEmail && <span>{app.candidateEmail}</span>}
                        {app.candidatePhone && <span>• {app.candidatePhone}</span>}
                    </div>
                </div>

                {/* Tabs Bar */}
                <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-neutral-800">
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
                </div>

                {/* Content: Left info + Right PDF */}
                <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
                    {/* Left: Tab Content */}
                    <div className="w-full lg:w-1/2 lg:border-r border-gray-200 dark:border-neutral-800 overflow-y-auto overflow-x-hidden scrollbar-thin">
                        <div className="p-5">
                            {activeTab === TAB_KEYS.BASIC ? (
                                <BasicInformation
                                    app={app}
                                    metaItems={[]}
                                    showDecisionHistory={false}
                                    onSwitchToAiTab={hasAi ? () => setActiveTab(TAB_KEYS.AI) : undefined}
                                />
                            ) : (
                                <AiAnalysis aiEvaluation={app.aiEvaluation} />
                            )}
                        </div>
                    </div>

                    {/* Right: PDF Viewer */}
                    {app.resumeUrl ? (
                        <div className="w-full lg:w-1/2 overflow-hidden">
                            <PdfViewer
                                resumeUrl={app.resumeUrl}
                                resumeName={app.resumeName}
                                candidateName={app.candidateName}
                            />
                        </div>
                    ) : (
                        <div className="w-full lg:w-1/2 flex items-center justify-center text-gray-500 bg-gray-50 dark:bg-neutral-900 flex-col gap-2">
                            <span className="text-sm">No PDF available</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TalentPoolCvDetail;
