import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useGetResumeDetailQuery } from '@/apis/jobApi';
import Loading from '@/components/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser } from '../../../utils/icons';
import { Sparkles } from 'lucide-react';
import PdfViewer from '@/pages/application/detail/pdf-viewer';
import BasicInformation from '@/pages/application/detail/basic-information';
import AiAnalysis from '@/pages/application/detail/ai-analysis';
import { useGetTalentPoolsQuery, useAddTalentPoolItemProposedMutation, useCreateTalentPoolMutation, useAddTalentPoolItemMutation, useMoveTalentPoolItemMutation } from '@/apis/talentPoolApi';
import Modal from '@/components/Modal';
import CreatePoolModal from '../../talent-pool/create-pool-modal';
import { FolderPlus, Plus } from 'lucide-react';
import { Tooltip } from 'antd';
import toastMessage from '@/utils/toastMessage';

const TAB_KEYS = {
    BASIC: 'basic',
    AI: 'ai',
};

const TalentPoolCvDetail = () => {
    const { resumeId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(TAB_KEYS.BASIC);
    const [isPoolModalOpen, setIsPoolModalOpen] = useState(false);
    const [isCreatePoolOpen, setIsCreatePoolOpen] = useState(false);
    const { data: poolsResponse } = useGetTalentPoolsQuery();
    const pools = poolsResponse?.data || [];
    const [addTalentPoolItemProposed, { isLoading: isAddingToProposed }] = useAddTalentPoolItemProposedMutation();
    const [addTalentPoolItem, { isLoading: isAddingToApplication }] = useAddTalentPoolItemMutation();
    const [moveTalentPoolItem, { isLoading: isMoving }] = useMoveTalentPoolItemMutation();
    const [createTalentPool, { isLoading: isCreatingPool }] = useCreateTalentPoolMutation();
    const isAddingToPool = isAddingToProposed || isAddingToApplication || isMoving;

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

    const handleAddToPool = async (poolId) => {
        const urlAppId = searchParams.get('applicationId');
        const urlProposedId = searchParams.get('proposedId');
        const urlItemId = searchParams.get('itemId');
        const urlCurrentGroupId = searchParams.get('groupId');
        const dataProposedId = resumeData.evaluations?.[0]?.proposedId;

        const finalAppId = urlAppId;
        const finalProposedId = urlProposedId || dataProposedId;

        try {
            if (urlItemId && urlCurrentGroupId && String(urlCurrentGroupId) !== String(poolId)) {
                await moveTalentPoolItem({ id: urlItemId, groupId: poolId }).unwrap();
                toastMessage.success('Candidate moved to new talent pool');
            } else if (finalAppId) {
                await addTalentPoolItem({ applicationId: finalAppId, groupId: poolId }).unwrap();
                toastMessage.success('Candidate added to talent pool');
            } else if (finalProposedId) {
                await addTalentPoolItemProposed({ proposedId: finalProposedId, groupId: poolId }).unwrap();
                toastMessage.success('Candidate added to talent pool');
            } else {
                toastMessage.error('Cannot perform action: missing source reference.');
                return;
            }

            // Sync URL with new pool
            setSearchParams(prev => {
                prev.set('groupId', poolId);
                return prev;
            });

            setIsPoolModalOpen(false);
        } catch (error) {
            toastMessage.error(error?.data?.message || 'Failed to update talent pool');
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
                <div className="shrink-0 px-5 pt-5 pb-3 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                            {app.candidateName}
                        </h1>
                        <div className="flex items-center gap-3 mt-1 cursor-default text-sm text-gray-500 dark:text-gray-400">
                            {app.candidateEmail && <span>{app.candidateEmail}</span>}
                            {app.candidatePhone && <span>• {app.candidatePhone}</span>}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Tooltip title="Add to Talent Pool">
                            <button
                                type="button"
                                onClick={() => setIsPoolModalOpen(true)}
                                className="flex items-center justify-center w-9 h-9 rounded-full border border-orange-200 bg-orange-50 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 dark:border-orange-900/50 dark:bg-orange-900/20"
                            >
                                <FolderPlus size={18} />
                            </button>
                        </Tooltip>
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

            {/* Add to Talent Pool Modal */}
            <Modal
                open={isPoolModalOpen}
                title="Add to Talent Pool"
                onCancel={() => setIsPoolModalOpen(false)}
                submitText="null"
                footer={null}
                width={400}
            >
                <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-3.5 pb-2 p-1">
                    {pools.length === 0 ? (
                        <div className="text-center py-6 bg-neutral-50 dark:bg-neutral-800 rounded-xl space-y-3">
                            <p className="text-gray-500 text-sm">No talent pools found.</p>
                        </div>
                    ) : (
                        pools.map(pool => {
                            const isCurrent = String(pool.id) === String(searchParams.get('groupId'));
                            return (
                                <button
                                    key={pool.id}
                                    onClick={() => handleAddToPool(pool.id)}
                                    disabled={isAddingToPool || isCurrent}
                                    className={`w-full text-left px-4 py-3 bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-100 dark:border-neutral-700 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:border-orange-200 dark:hover:border-orange-500/30 transition-all flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed ${isCurrent ? 'ring-2 ring-inset ring-orange-500/50' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-3.5 h-3.5 rounded-full ring-2 ring-white dark:ring-neutral-900 shadow-sm" style={{ backgroundColor: pool.color || '#ccc' }}></div>
                                        <span className="font-medium text-sm text-neutral-800 dark:text-neutral-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                            {pool.name}
                                            {isCurrent && <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-orange-500">(Current)</span>}
                                        </span>
                                    </div>
                                    {isCurrent && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                                </button>
                            );
                        })
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

export default TalentPoolCvDetail;
