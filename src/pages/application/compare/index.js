import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGetApplicationDetailQuery } from '@/apis/applicationApi';
import Loading from '@/components/Loading';
import AiAnalysis from '../detail/ai-analysis';
import { normalizeApplicationDetail } from '../detail/utils';
import { ArrowLeft, GitCompareArrows } from 'lucide-react';

const formatScore = (value) => (
    typeof value === 'number' ? `${Math.round(value)}%` : 'N/A'
);

const CompareColumn = ({ title, app }) => {
    const aiScore = app.aiEvaluation?.aiOverallScore ?? app.aiScore;

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="space-y-5">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">{title}</p>
                    <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{app.candidateName}</h2>
                </div>

                <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4 dark:border-orange-900/30 dark:bg-orange-900/10">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">AI Score</p>
                    <div className="mt-3 flex items-end justify-between gap-4">
                        <span className="text-4xl font-bold text-orange-600 dark:text-orange-300">
                            {formatScore(aiScore)}
                        </span>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-600 shadow-sm dark:bg-neutral-800 dark:text-orange-300">
                            AI Analysis
                        </span>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="mb-4 flex items-center gap-2">
                        <GitCompareArrows size={18} className="text-orange-500" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Analysis</h3>
                    </div>
                    <AiAnalysis aiEvaluation={app.aiEvaluation} variant="compare" />
                </div>
            </div>
        </div>
    );
};

const ApplicationCompare = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const leftId = searchParams.get('left');
    const rightId = searchParams.get('right');

    const { data: leftResponse, isLoading: isLeftLoading } = useGetApplicationDetailQuery(leftId, { skip: !leftId });
    const { data: rightResponse, isLoading: isRightLoading } = useGetApplicationDetailQuery(rightId, { skip: !rightId });

    const leftApp = normalizeApplicationDetail(leftResponse?.data);
    const rightApp = normalizeApplicationDetail(rightResponse?.data);

    if (!leftId || !rightId) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="rounded-2xl border border-gray-200 bg-white px-6 py-8 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">Select 2 applications to compare</p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
                        Open this page from the application list or detail page.
                    </p>
                </div>
            </div>
        );
    }

    if (isLeftLoading || isRightLoading) {
        return <Loading className="py-20" />;
    }

    if (!leftApp || !rightApp) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="rounded-2xl border border-gray-200 bg-white px-6 py-8 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">Unable to load applications</p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
                        One of the selected applications no longer exists or is not accessible.
                    </p>
                </div>
            </div>
        );
    }

    if (leftApp.jobId !== rightApp.jobId) {
        return (
            <div className="space-y-4">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-orange-500 hover:text-orange-600"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>
                <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center dark:border-red-900/40 dark:bg-red-900/10">
                    <p className="text-lg font-semibold text-red-700 dark:text-red-300">These applications belong to different jobs</p>
                    <p className="mt-2 text-sm text-red-600/80 dark:text-red-300/80">
                        Please select two applications from the same job to compare.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">Application Compare</p>
                    <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{leftApp.jobTitle}</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                        Side-by-side review for two applications in the same job.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 rounded-xl border border-orange-200 px-4 py-2 text-sm font-medium text-orange-600 transition-colors hover:bg-orange-50"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <CompareColumn title="Application A" app={leftApp} />
                <CompareColumn title="Application B" app={rightApp} />
            </div>
        </div>
    );
};

export default ApplicationCompare;
