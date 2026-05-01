import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faFileLines, faFilePdf, faGlobe, faLocationDot, faPhone } from '../../../utils/icons';
import { faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { useGetApplicationDetailQuery } from '@/apis/applicationApi';
import Loading from '@/components/Loading';
import AiAnalysis from '../detail/ai-analysis';
import { normalizeApplicationDetail } from '../detail/utils';
import PdfCvViewer from '@/pages/cv-preview/pdf-viewer';
import DocxViewer from '@/pages/cv-preview/docx-viewer';
import { ArrowLeft } from 'lucide-react';

const PAGE_TABS = {
    AI: 'ai',
    RESUME: 'resume',
};

const getResumeFileType = (resumeName, resumeUrl) => {
    const source = `${resumeName || ''} ${resumeUrl || ''}`.toLowerCase();

    if (/\.pdf($|[?#\s])/.test(source)) return 'pdf';
    if (/\.docx?($|[?#\s])/.test(source)) return 'docx';

    return 'unknown';
};

const normalizeUrl = (url) => {
    if (!url) return url;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;

    return `https://${url}`;
};

const ContactItem = ({ icon, label, value, href }) => {
    if (!value) return null;

    return (
        <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950/40">
            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-orange-500 dark:bg-orange-900/20 dark:text-orange-300">
                <FontAwesomeIcon icon={icon} className="text-sm" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400 dark:text-neutral-500">{label}</p>
                {href ? (
                    <a
                        href={href}
                        className="mt-1 block truncate text-sm font-medium text-gray-800 transition-colors hover:text-orange-500 dark:text-neutral-100"
                    >
                        {value}
                    </a>
                ) : (
                    <p className="mt-1 break-words text-sm font-medium text-gray-800 dark:text-neutral-100">{value}</p>
                )}
            </div>
        </div>
    );
};

const SocialLink = ({ icon, label, href, className }) => (
    <a
        href={normalizeUrl(href)}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${className}`}
    >
        <FontAwesomeIcon icon={icon} />
        {label}
    </a>
);

const ResumePreviewPane = ({ app }) => {
    const fileType = getResumeFileType(app.resumeName, app.resumeUrl);

    if (!app.resumeUrl) {
        return (
            <div className="flex min-h-[520px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center dark:border-neutral-700 dark:bg-neutral-800/40">
                <div>
                    <p className="text-base font-semibold text-gray-800 dark:text-neutral-100">No resume available</p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
                        This application does not include a resume file for preview.
                    </p>
                </div>
            </div>
        );
    }

    if (fileType === 'unknown') {
        return (
            <div className="flex min-h-[520px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center dark:border-neutral-700 dark:bg-neutral-800/40">
                <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-neutral-800 dark:text-neutral-500">
                        <FontAwesomeIcon icon={faFileLines} className="text-xl" />
                    </div>
                    <p className="mt-4 text-base font-semibold text-gray-800 dark:text-neutral-100">Preview not supported</p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
                        This resume format cannot be previewed inline.
                    </p>
                    <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 rounded-full border border-orange-200 px-4 py-2 text-sm font-medium text-orange-600 transition-colors hover:bg-orange-50"
                    >
                        <FontAwesomeIcon icon={faFilePdf} className="text-sm" />
                        Download Resume
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3 dark:border-neutral-800">
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-800 dark:text-neutral-100">
                        {app.resumeName || `${app.candidateName} Resume`}
                    </p>
                    <p className="mt-0.5 text-xs uppercase tracking-[0.18em] text-gray-400 dark:text-neutral-500">
                        {fileType === 'pdf' ? 'PDF Preview' : 'DOC/DOCX Preview'}
                    </p>
                </div>
                <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-full border border-orange-200 px-3 py-1.5 text-xs font-semibold text-orange-600 transition-colors hover:bg-orange-50"
                >
                    Open
                </a>
            </div>
            <div className="h-[75vh] min-h-[520px]">
                {fileType === 'pdf' ? (
                    <PdfCvViewer fileUrl={app.resumeUrl} />
                ) : (
                    <DocxViewer fileUrl={app.resumeUrl} fileName={app.resumeName || `${app.candidateName}.docx`} />
                )}
            </div>
        </div>
    );
};

const CompareColumn = ({ app, activeTab }) => {
    const socialLinks = useMemo(() => ([
        app.linkedinLink && {
            key: 'linkedin',
            label: 'LinkedIn',
            href: app.linkedinLink,
            icon: faLinkedinIn,
            className: 'bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20',
        },
        app.githubLink && {
            key: 'github',
            label: 'GitHub',
            href: app.githubLink,
            icon: faGithub,
            className: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700',
        },
        app.portfolioLink && {
            key: 'portfolio',
            label: 'Portfolio',
            href: app.portfolioLink,
            icon: faGlobe,
            className: 'bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-300',
        },
    ].filter(Boolean)), [app.githubLink, app.linkedinLink, app.portfolioLink]);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="space-y-5">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{app.candidateName}</h2>
                    <p className="mt-1 text-sm font-medium text-orange-500">{app.jobTitle}</p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-4 dark:border-neutral-800 dark:bg-neutral-950/30">
                    <div className="mb-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">Contact Information</p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                            Quick access to candidate contact details and profile links.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <ContactItem
                            icon={faPhone}
                            label="Phone"
                            value={app.candidatePhone}
                            href={app.candidatePhone ? `tel:${app.candidatePhone}` : undefined}
                        />
                        <ContactItem
                            icon={faEnvelope}
                            label="Email"
                            value={app.candidateEmail}
                            href={app.candidateEmail ? `mailto:${app.candidateEmail}` : undefined}
                        />
                        <ContactItem
                            icon={faLocationDot}
                            label="Location"
                            value={app.location}
                        />
                    </div>

                    {socialLinks.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {socialLinks.map((link) => (
                                <SocialLink
                                    key={link.key}
                                    icon={link.icon}
                                    label={link.label}
                                    href={link.href}
                                    className={link.className}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {activeTab === PAGE_TABS.AI ? (
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <AiAnalysis aiEvaluation={app.aiEvaluation} variant="compare" />
                    </div>
                ) : (
                    <ResumePreviewPane app={app} />
                )}
            </div>
        </div>
    );
};

const ApplicationCompare = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(PAGE_TABS.AI);
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
            <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
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

                <div className="inline-flex rounded-full bg-gray-100 p-1 dark:bg-neutral-800">
                    {[
                        { key: PAGE_TABS.AI, label: 'AI Analysis' },
                        { key: PAGE_TABS.RESUME, label: 'Resume' },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => setActiveTab(tab.key)}
                            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-150 ${
                                activeTab === tab.key
                                    ? 'bg-white text-gray-900 shadow-sm dark:bg-neutral-700 dark:text-white'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
                <CompareColumn app={leftApp} activeTab={activeTab} />
                <CompareColumn app={rightApp} activeTab={activeTab} />
            </div>
        </div>
    );
};

export default ApplicationCompare;
