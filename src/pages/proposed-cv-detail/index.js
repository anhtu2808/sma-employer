import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useGetProposedCvDetailQuery, useGetResumeDetailQuery, useUnlockProposedCvMutation } from '@/apis/jobApi';
import { useGetTalentPoolsQuery, useAddTalentPoolItemProposedMutation, useCreateTalentPoolMutation } from '@/apis/talentPoolApi';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import Overview from './Overview';
import BasicInformation from '@/pages/application/detail/basic-information';
import AiAnalysis from '@/pages/application/detail/ai-analysis';
import CreatePoolModal from '../talent-pool/create-pool-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '../../utils/icons';
import { Lock, Sparkles, Plus } from 'lucide-react';
import toastMessage from '@/utils/toastMessage';
import ResumePreviewPanel from './ResumePreviewPanel';

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
    const { data: response, isLoading, error, refetch } = useGetProposedCvDetailQuery(numericProposedResumeId, {
        skip: !hasValidProposedResumeId,
    });
    const [unlockProposedCv, { isLoading: isUnlocking }] = useUnlockProposedCvMutation();

    // Talent Pool Logic
    const [isPoolModalOpen, setIsPoolModalOpen] = useState(false);
    const [isCreatePoolOpen, setIsCreatePoolOpen] = useState(false);
    const { data: poolsResponse } = useGetTalentPoolsQuery();
    const pools = poolsResponse?.data || [];
    const [addTalentPoolItemProposed, { isLoading: isAddingToPool }] = useAddTalentPoolItemProposedMutation();
    const [createTalentPool, { isLoading: isCreatingPool }] = useCreateTalentPoolMutation();

    const cvData = response?.data;
    const proposedCv = normalizeProposedCvDetail(cvData);
    const shouldLoadProfileResume = Boolean(
        proposedCv?.isUnlocked
        && proposedCv?.resumeType === 'PROFILE'
        && Number.isInteger(Number(proposedCv?.resumeId))
    );
    const {
        data: profileResumeResponse,
        isFetching: isProfileResumeLoading,
        isError: isProfileResumeError,
        error: profileResumeError,
    } = useGetResumeDetailQuery(proposedCv?.resumeId, {
        skip: !shouldLoadProfileResume,
    });
    const profileResume = profileResumeResponse?.data ?? null;
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

    const handleUnlock = async () => {
        if (!numericProposedResumeId) return;

        try {
            await unlockProposedCv(numericProposedResumeId).unwrap();
            toastMessage.success('Candidate profile unlocked successfully.');
            await refetch();
        } catch (unlockError) {
            toastMessage.error(unlockError?.data?.message || 'Failed to unlock proposed CV');
        }
    };

    const handleAddToPool = async (poolId) => {
        try {
            await addTalentPoolItemProposed({ proposedId: numericProposedResumeId, groupId: poolId }).unwrap();
            toastMessage.success('Candidate added to talent pool');
            setIsPoolModalOpen(false);
            refetch();
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
                        metaItems={[]}
                        showDecisionHistory={false}
                        hideCandidateSummary
                        renderInsightsExpanded
                        maskPrivateContactWhenLocked
                        hideSocialLinksWhenLocked
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
                    <Overview
                        proposal={proposedCv}
                        proposedResumeId={numericProposedResumeId}
                        onUnlock={handleUnlock}
                        isUnlocking={isUnlocking}
                        refetch={refetch}
                        onOpenAddToPool={() => setIsPoolModalOpen(true)}
                    />
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
                    <div className="w-full lg:w-[45%] lg:border-r border-gray-200 dark:border-neutral-800 overflow-y-auto overflow-x-hidden scrollbar-thin">
                        <div className="p-5">
                            {renderTabContent()}
                        </div>
                    </div>

                    <div className="w-full lg:w-[55%] overflow-hidden">
                        {!proposedCv.isUnlocked ? (
                            <div className="h-full min-h-[720px] flex flex-col items-center justify-center gap-3 px-6 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                                    <Lock size={28} />
                                </div>
                                <p className="text-base font-semibold text-gray-700 dark:text-neutral-200">
                                    Unlock required to view the candidate CV
                                </p>
                                <p className="max-w-md text-sm text-gray-500 dark:text-gray-400">
                                    Recruiters can review the AI analysis first, but the resume preview and personal details stay hidden until this proposed CV is unlocked.
                                </p>
                            </div>
                        ) : (
                            <ResumePreviewPanel
                                proposal={proposedCv}
                                profileResume={profileResume}
                                isProfileResumeLoading={isProfileResumeLoading}
                                isProfileResumeError={isProfileResumeError}
                                profileResumeError={profileResumeError}
                            />
                        )}
                    </div>
                </div>
            </div>

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

const normalizeProposedCvDetail = (payload) => {
    if (!payload) return null;

    const isUnlocked = Boolean(payload.unlocked);
    const aiScore = normalizePercentNumber(payload.ai_overall_score);
    const matchRate = normalizePercentNumber(payload.match_rate);
    const hasAi = aiScore != null || payload.summary || payload.strengths || payload.weakness;

    return {
        candidateId: payload.candidate_id || null,
        resumeId: payload.resume_id || null,
        jobId: payload.job_id || null,
        candidateName: payload.full_name || payload.resume_name || payload.file_name || 'Unknown Candidate',
        candidateEmail: payload.email || null,
        candidatePhone: payload.phone || null,
        jobTitle: payload.job_title || null,
        location: payload.address || null,
        avatar: payload.avatar || null,
        githubLink: payload.github_link || null,
        linkedinLink: payload.linkedin_link || null,
        portfolioLink: payload.portfolio_link || null,
        resumeType: payload.resume_type || null,
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
        resumeName: isUnlocked ? (payload.file_name || payload.resume_name || payload.full_name || 'Resume') : null,
        proposalStatus: payload.status || null,
        status: payload.status || null,
        proposedAt: payload.proposed_at || null,
        matchRate,
        isUnlocked,
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

export default ProposedCVDetail;
