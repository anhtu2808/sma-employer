import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGetApplicationDetailQuery } from '@/apis/applicationApi';
import Loading from '@/components/Loading';
import { getApplicationStatusConfig } from '@/constrant/application';
import BasicInformation from '../detail/basic-information';
import AiAnalysis from '../detail/ai-analysis';
import CoverLetter from '../detail/cover-letter';
import PdfViewer from '../detail/pdf-viewer';
import { normalizeApplicationDetail } from '../detail/utils';
import { ArrowLeft, GitCompareArrows, FileText } from 'lucide-react';

const formatDateTime = (value) => (
    value ? new Date(value).toLocaleString() : 'N/A'
);

const buildMetaItems = (app) => {
    const statusConfig = getApplicationStatusConfig(app.status);

    return [
        {
            label: 'Status',
            value: statusConfig.label,
            valueClassName: `text-lg font-semibold ${statusConfig.textColor || 'text-gray-800'}`,
        },
        {
            label: 'Applied At',
            value: formatDateTime(app.appliedAt),
        },
        {
            label: 'Attempt',
            value: app.attempt ?? 'N/A',
        },
        {
            label: 'Source',
            value: app.source || 'N/A',
        },
        {
            label: 'AI Score',
            value: app.aiScore != null ? `${Math.round(app.aiScore)}%` : 'N/A',
            valueClassName: 'text-lg font-semibold text-orange-500',
        },
        {
            label: 'Recruiter Score',
            value: app.recruiterScore != null ? `${Math.round(app.recruiterScore)}%` : 'N/A',
            valueClassName: 'text-lg font-semibold text-sky-600',
        },
    ];
};

const CompareColumn = ({ title, app }) => (
    <div className="space-y-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">{title}</p>
                    <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{app.candidateName}</h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">{app.jobTitle}</p>
                </div>
                <div className="rounded-xl bg-orange-50 px-3 py-2 text-right dark:bg-orange-900/20">
                    <p className="text-xs uppercase tracking-[0.18em] text-orange-500">Resume</p>
                    <p className="mt-1 text-sm font-semibold text-orange-700 dark:text-orange-300">
                        {app.resumeName || 'Attached resume'}
                    </p>
                </div>
            </div>

            <BasicInformation
                app={app}
                metaTitle="Application Snapshot"
                metaItems={buildMetaItems(app)}
                emphasizeMeta
                renderInsightsExpanded
            />
        </div>

        {app.aiEvaluation && (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div className="mb-4 flex items-center gap-2">
                    <GitCompareArrows size={18} className="text-orange-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Evaluation</h3>
                </div>
                <AiAnalysis aiEvaluation={app.aiEvaluation} />
            </div>
        )}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-4 flex items-center gap-2">
                <FileText size={18} className="text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cover Letter</h3>
            </div>
            {app.coverLetter ? (
                <CoverLetter coverLetter={app.coverLetter} />
            ) : (
                <p className="text-sm text-gray-500 dark:text-neutral-400">No cover letter submitted.</p>
            )}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Resume Preview</h3>
                    <p className="text-sm text-gray-500 dark:text-neutral-400">{app.resumeName || 'Attached resume'}</p>
                </div>
                {app.resumeUrl && (
                    <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-orange-500 hover:text-orange-600"
                    >
                        Open file
                    </a>
                )}
            </div>
            {app.resumeUrl ? (
                <div className="h-[720px] overflow-hidden rounded-xl border border-gray-100 dark:border-neutral-800">
                    <PdfViewer
                        resumeUrl={app.resumeUrl}
                        resumeName={app.resumeName}
                        candidateName={app.candidateName}
                    />
                </div>
            ) : (
                <p className="text-sm text-gray-500 dark:text-neutral-400">No resume preview available.</p>
            )}
        </div>
    </div>
);

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
        return <Loading className="py-20" size={96} />;
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
