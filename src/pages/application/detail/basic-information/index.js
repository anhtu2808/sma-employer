import React, { useState } from 'react';
import { Collapse, ConfigProvider } from 'antd';
import toastMessage from '@/utils/toastMessage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEnvelope, faPhone, faLocationDot, faCopy, faArrowRight,
    faCircleQuestion, faUser, faThumbsUp, faThumbsDown,
    faCircleXmark, faCircleCheck, faGlobe, faBriefcase,
} from '../../../../utils/icons';
import { faLinkedinIn, faGithub } from '@fortawesome/free-brands-svg-icons';
import { getApplicationStatusConfig } from '@/constrant/application';
import Answers from '../answers';

const CopyableField = ({ icon, value, href, masked = false }) => {
    if (masked) {
        return (
            <div className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={icon} className="text-base text-gray-500 dark:text-neutral-400 w-4" />
                <div className="flex-1 min-w-0">
                    <span className="inline-flex max-w-full rounded-md bg-gray-200/80 px-2.5 py-1 text-base font-medium tracking-[0.18em] text-gray-500 blur-[1px] dark:bg-neutral-700/80 dark:text-neutral-300">
                        {value}
                    </span>
                </div>
            </div>
        );
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(value).then(() => {
            toastMessage.success('Copied!');
        });
    };

    return (
        <div className="flex items-center gap-2.5 group">
            <FontAwesomeIcon icon={icon} className="text-base text-gray-500 dark:text-neutral-400 w-4" />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                    {href ? (
                        <a href={href} className="text-base font-medium text-gray-800 dark:text-neutral-200 hover:text-orange-500 transition-colors truncate">
                            {value}
                        </a>
                    ) : (
                        <span className="text-base font-medium text-gray-800 dark:text-neutral-200 truncate">{value}</span>
                    )}
                    <button
                        onClick={handleCopy}
                        className="p-0.5 rounded text-gray-300 hover:text-orange-500 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                        title="Copy"
                    >
                        <FontAwesomeIcon icon={faCopy} className="text-[12px]" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const InsightSection = ({ section }) => (
    <div className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 dark:border-neutral-700 dark:bg-neutral-800/30">
        <div className="mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={section.icon} className={`text-base ${section.iconClassName}`} />
            <h3 className={`text-base font-bold ${section.titleClassName}`}>{section.title}</h3>
        </div>
        <div
            className="prose max-w-none text-gray-800 dark:text-neutral-200 leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:text-base [&_li]:list-disc [&_li]:text-gray-800 dark:[&_li]:text-neutral-200"
            dangerouslySetInnerHTML={{ __html: section.content }}
        />
    </div>
);

const LockedSocialPill = ({ label }) => (
    <span className="inline-flex items-center rounded-lg border border-dashed border-gray-300 bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
        {label}
    </span>
);

const BasicInformation = ({
    app,
    onSwitchToAiTab,
    metaTitle = 'Application Info',
    metaItems,
    showDecisionHistory = true,
    hideCandidateSummary = false,
    hideLocationInContact = false,
    emphasizeMeta = false,
    renderInsightsExpanded = false,
    maskPrivateContactWhenLocked = false,
    hideSocialLinksWhenLocked = false,
}) => {
    const [openAccordionKey, setOpenAccordionKey] = useState('about');
    const isPrivateInfoLocked = maskPrivateContactWhenLocked && app?.isUnlocked === false;

    const statusConfig = app.status
        ? getApplicationStatusConfig(app.status)
        : { label: 'N/A', textColor: 'text-gray-500' };

    const hasAnswers = app.answers?.length > 0;
    const hasSummary = !!app.aiEvaluation?.summary;
    const hasStrengths = !!app.aiEvaluation?.strengths;
    const hasWeakness = !!app.aiEvaluation?.weakness;
    const hasInsights = hasSummary || hasStrengths || hasWeakness;
    const hasAccordion = hasAnswers || (!renderInsightsExpanded && hasInsights);
    const hasSocialLinks = app.linkedinLink || app.githubLink || app.portfolioLink;
    const defaultMetaItems = [
        app.status && {
            label: 'Status',
            value: statusConfig.label,
            valueClassName: statusConfig.textColor,
        },
        app.appliedAt && {
            label: 'Applied',
            value: new Date(app.appliedAt).toLocaleDateString(),
        },
        app.source && {
            label: 'Source',
            value: app.source,
        },
        app.aiScore != null && {
            label: 'AI Score',
            value: `${app.aiScore}%`,
            labelClassName: 'text-orange-400',
            valueClassName: 'text-sm font-bold text-orange-500 group-hover:text-orange-600',
            wrapperClassName: 'bg-orange-50 dark:bg-orange-900/10 hover:bg-orange-100 dark:hover:bg-orange-900/20',
            onClick: onSwitchToAiTab,
            trailingIcon: <FontAwesomeIcon icon={faArrowRight} className="text-[13px] ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />,
        },
    ].filter(Boolean);
    const resolvedMetaItems = (metaItems ?? defaultMetaItems).filter(Boolean);
    const showCandidateSummary = !hideCandidateSummary;
    const showContactSection = Boolean(
        app.candidatePhone
        || app.candidateEmail
        || (!hideLocationInContact && app.location)
    );
    const showInfoCard = showCandidateSummary || showContactSection;
    const showLockedSocialLinks = Boolean(isPrivateInfoLocked && hideSocialLinksWhenLocked && hasSocialLinks);

    const accordionItems = [
        hasAnswers && {
            key: 'qa',
            label: (
                <span className="flex items-center gap-2 font-semibold text-gray-700 dark:text-neutral-200">
                    <FontAwesomeIcon icon={faCircleQuestion} className="text-orange-500" />
                    Screening Questions
                </span>
            ),
            children: <Answers answers={app.answers} />,
        },
        !renderInsightsExpanded && hasSummary && {
            key: 'about',
            label: (
                <span className="flex items-center gap-2 font-bold text-gray-800 dark:text-neutral-200">
                    <FontAwesomeIcon icon={faUser} className="text-gray-500 dark:text-neutral-400" />
                    About Candidate
                </span>
            ),
            children: (
                <div
                    className="prose max-w-none text-gray-800 dark:text-neutral-200 leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:text-base [&_li]:list-disc [&_li]:text-gray-800 dark:[&_li]:text-neutral-200"
                    dangerouslySetInnerHTML={{ __html: app.aiEvaluation.summary }}
                />
            ),
        },
        !renderInsightsExpanded && hasStrengths && {
            key: 'strengths',
            label: (
                <span className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
                    <FontAwesomeIcon icon={faThumbsUp} className="text-emerald-500 dark:text-emerald-400" />
                    Strengths
                </span>
            ),
            children: (
                <div
                    className="prose max-w-none text-gray-800 dark:text-neutral-200 leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:text-base [&_li]:list-disc [&_li]:text-gray-800 dark:[&_li]:text-neutral-200"
                    dangerouslySetInnerHTML={{ __html: app.aiEvaluation.strengths }}
                />
            ),
        },
        !renderInsightsExpanded && hasWeakness && {
            key: 'weaknesses',
            label: (
                <span className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400">
                    <FontAwesomeIcon icon={faThumbsDown} className="text-amber-500 dark:text-amber-400" />
                    Weaknesses
                </span>
            ),
            children: (
                <div
                    className="prose max-w-none text-gray-800 dark:text-neutral-200 leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:text-base [&_li]:list-disc [&_li]:text-gray-800 dark:[&_li]:text-neutral-200"
                    dangerouslySetInnerHTML={{ __html: app.aiEvaluation.weakness }}
                />
            ),
        },
    ].filter(Boolean);

    const insightSections = [
        hasSummary && {
            key: 'about',
            title: 'About Candidate',
            titleClassName: 'text-gray-800 dark:text-neutral-200',
            icon: faUser,
            iconClassName: 'text-gray-500 dark:text-neutral-400',
            content: app.aiEvaluation.summary,
        },
        hasStrengths && {
            key: 'strengths',
            title: 'Strengths',
            titleClassName: 'text-emerald-600 dark:text-emerald-400',
            icon: faThumbsUp,
            iconClassName: 'text-emerald-500 dark:text-emerald-400',
            content: app.aiEvaluation.strengths,
        },
        hasWeakness && {
            key: 'weaknesses',
            title: 'Weaknesses',
            titleClassName: 'text-amber-600 dark:text-amber-400',
            icon: faThumbsDown,
            iconClassName: 'text-amber-500 dark:text-amber-400',
            content: app.aiEvaluation.weakness,
        },
    ].filter(Boolean);

    return (
        <div className="space-y-6">
            {/* Candidate Info + Contact */}
            {showInfoCard && (
                <div className="bg-gray-50 dark:bg-neutral-800/30 rounded-xl p-5 space-y-5">
                    {/* Candidate Info */}
                    {showCandidateSummary && (
                        <div className="space-y-2.5">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{app.candidateName}</h2>
                            <div className="flex items-center gap-2 text-base text-gray-800 dark:text-neutral-200">
                                <FontAwesomeIcon icon={faBriefcase} className="text-sm text-gray-500 dark:text-neutral-400" />
                                <span>{app.jobTitle}</span>
                            </div>
                            {app.location && (
                                <div className="flex items-center gap-2 text-base text-gray-800 dark:text-neutral-200">
                                    <FontAwesomeIcon icon={faGlobe} className="text-sm text-gray-500 dark:text-neutral-400" />
                                    <span>{app.location}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Divider */}
                    {showCandidateSummary && showContactSection && (
                        <div className="border-t border-gray-200 dark:border-neutral-700" />
                    )}

                    {/* Contact Information */}
                    {showContactSection && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-gray-600 dark:text-neutral-300 uppercase tracking-wider">
                                Contact Information
                            </h4>
                            <div className="flex flex-col gap-3">
                                {app.candidatePhone && (
                                    <CopyableField
                                        icon={faPhone}
                                        value={isPrivateInfoLocked ? getMaskedPhone(app.candidatePhone) : app.candidatePhone}
                                        href={isPrivateInfoLocked ? undefined : `tel:${app.candidatePhone}`}
                                        masked={isPrivateInfoLocked}
                                    />
                                )}
                                {app.candidateEmail && (
                                    <CopyableField
                                        icon={faEnvelope}
                                        value={isPrivateInfoLocked ? getMaskedEmail(app.candidateEmail) : app.candidateEmail}
                                        href={isPrivateInfoLocked ? undefined : `mailto:${app.candidateEmail}`}
                                        masked={isPrivateInfoLocked}
                                    />
                                )}
                                {!hideLocationInContact && app.location && (
                                    <CopyableField
                                        icon={faLocationDot}
                                        value={isPrivateInfoLocked ? getMaskedAddress(app.location) : app.location}
                                        masked={isPrivateInfoLocked}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Social Links */}
            {hasSocialLinks && !showLockedSocialLinks && (
                <div className="space-y-3">
                    <h4 className="text-sm font-bold text-gray-600 dark:text-neutral-300 uppercase tracking-wider">
                        Social
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {app.linkedinLink && (
                            <a
                                href={app.linkedinLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-colors"
                            >
                                <FontAwesomeIcon icon={faLinkedinIn} />
                                LinkedIn
                            </a>
                        )}
                        {app.githubLink && (
                            <a
                                href={app.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                            >
                                <FontAwesomeIcon icon={faGithub} />
                                GitHub
                            </a>
                        )}
                        {app.portfolioLink && (
                            <a
                                href={app.portfolioLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 hover:bg-orange-100 transition-colors"
                            >
                                <FontAwesomeIcon icon={faGlobe} />
                                Portfolio
                            </a>
                        )}
                    </div>
                </div>
            )}

            {showLockedSocialLinks && (
                <div className="space-y-3">
                    <h4 className="text-sm font-bold text-gray-600 dark:text-neutral-300 uppercase tracking-wider">
                        Social
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {app.linkedinLink && <LockedSocialPill label="LinkedIn locked" />}
                        {app.githubLink && <LockedSocialPill label="GitHub locked" />}
                        {app.portfolioLink && <LockedSocialPill label="Portfolio locked" />}
                    </div>
                </div>
            )}

            {renderInsightsExpanded && insightSections.length > 0 && (
                <div className="space-y-4">
                    {insightSections.map((section) => (
                        <InsightSection key={section.key} section={section} />
                    ))}
                </div>
            )}

            {/* Accordion Sections */}
            {hasAccordion && (
                <ConfigProvider
                    theme={{
                        components: {
                            Collapse: {
                                headerBg: 'transparent',
                                contentBg: 'transparent',
                                colorBorder: 'rgb(229 231 235)',
                                contentPadding: '16px 16px 16px 40px',
                            },
                        },
                    }}
                >
                    <Collapse
                        accordion
                        activeKey={openAccordionKey}
                        onChange={(key) => setOpenAccordionKey(key)}
                        items={accordionItems}
                        bordered={false}
                        className="bg-gray-50 dark:bg-neutral-800/30 rounded-xl overflow-hidden [&_.ant-collapse-item]:border-b [&_.ant-collapse-item]:border-gray-200 dark:[&_.ant-collapse-item]:border-neutral-700 [&_.ant-collapse-item:last-child]:border-b-0"
                        expandIconPosition="end"
                    />
                </ConfigProvider>
            )}

            {/* Application Info Grid */}
            {resolvedMetaItems.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-bold text-gray-600 dark:text-neutral-300 uppercase tracking-wider">
                        {metaTitle}
                    </h4>
                    <div className={`grid gap-3 ${emphasizeMeta ? 'grid-cols-1' : 'grid-cols-2'}`}>
                        {resolvedMetaItems.map((item, index) => {
                            const cardClassName = `flex flex-col rounded-xl text-left transition-colors ${
                                emphasizeMeta ? 'gap-2 p-4 sm:p-5 min-h-[104px]' : 'gap-1 p-3'
                            } ${
                                item.wrapperClassName || 'bg-gray-50 dark:bg-neutral-800/50'
                            }`;
                            const labelClassName = item.labelClassName || (emphasizeMeta
                                ? 'text-xs font-semibold uppercase tracking-[0.18em] text-gray-500'
                                : 'text-sm text-gray-500');
                            const valueClassName = item.valueClassName || (emphasizeMeta
                                ? 'text-lg font-semibold text-gray-800 dark:text-neutral-100'
                                : 'text-base font-medium text-gray-800 dark:text-neutral-200');

                            if (item.onClick) {
                                return (
                                    <button
                                        key={`${item.label}-${index}`}
                                        onClick={item.onClick}
                                        className={`${cardClassName} group`}
                                    >
                                        <span className={labelClassName}>{item.label}</span>
                                        <span className={valueClassName}>
                                            {item.value}
                                            {item.trailingIcon}
                                        </span>
                                    </button>
                                );
                            }

                            return (
                                <div key={`${item.label}-${index}`} className={cardClassName}>
                                    <span className={labelClassName}>{item.label}</span>
                                    <span className={valueClassName}>{item.value}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Decision History */}
            {showDecisionHistory && (app.status === 'REJECTED' || app.status === 'APPROVED') && (
                <div className="space-y-3">
                    <h4 className="text-sm font-bold text-gray-600 dark:text-neutral-300 uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                            <FontAwesomeIcon
                                icon={app.status === 'REJECTED' ? faCircleXmark : faCircleCheck}
                                className={`text-sm ${app.status === 'REJECTED' ? 'text-red-500' : 'text-green-500'}`}
                            />
                            Decision History
                        </span>
                    </h4>
                    <div className="p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-xl space-y-3">
                        <div className="space-y-2">
                            <div>
                                <span className="text-sm text-gray-500">Processed By</span>
                                <p className="text-base font-medium text-gray-800 dark:text-neutral-200 mt-0.5 break-all">
                                    {app.reviewedByEmail || 'System / Auto'}
                                </p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">Processed At</span>
                                <p className="text-base font-medium text-gray-800 dark:text-neutral-200 mt-0.5">
                                    {app.reviewedAt ? new Date(app.reviewedAt).toLocaleString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                        {app.status === 'REJECTED' && app.rejectReason && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-red-600">Rejection Reason</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${app.showRejectReason ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                        {app.showRejectReason ? 'Visible to Candidate' : 'Internal Only'}
                                    </span>
                                </div>
                                <p className="text-sm text-red-700 dark:text-red-300/80 italic">{app.rejectReason}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const getMaskedEmail = (value) => {
    if (!value) return '*****@*****';

    const [localPart = '', domainPart = ''] = String(value).split('@');
    const maskedLocal = maskKeepEdges(localPart, 1, 0);
    const domainSegments = domainPart.split('.');
    const primaryDomain = domainSegments.shift() || '';
    const topLevelDomain = domainSegments.join('.');
    const maskedDomain = maskKeepEdges(primaryDomain, 1, 0);

    return topLevelDomain
        ? `${maskedLocal}@${maskedDomain}.${maskKeepEdges(topLevelDomain, 0, 0)}`
        : `${maskedLocal}@${maskedDomain}`;
};

const getMaskedPhone = (value) => {
    if (!value) return '********';

    const digits = String(value).replace(/\D/g, '');
    if (!digits) return '********';

    return digits.length <= 4
        ? '*'.repeat(digits.length)
        : `${'*'.repeat(Math.max(0, digits.length - 2))}${digits.slice(-2)}`;
};

const getMaskedAddress = (value) => {
    if (!value) return '**********';
    return maskKeepEdges(String(value).trim(), 0, 0);
};

const maskKeepEdges = (value, visibleStart = 0, visibleEnd = 0) => {
    const normalizedValue = String(value || '').trim();
    if (!normalizedValue) return '****';

    const safeVisibleStart = Math.max(0, visibleStart);
    const safeVisibleEnd = Math.max(0, visibleEnd);

    if (normalizedValue.length <= safeVisibleStart + safeVisibleEnd) {
        return '*'.repeat(Math.max(4, normalizedValue.length));
    }

    const start = normalizedValue.slice(0, safeVisibleStart);
    const end = safeVisibleEnd > 0 ? normalizedValue.slice(-safeVisibleEnd) : '';
    const maskedLength = Math.max(4, normalizedValue.length - safeVisibleStart - safeVisibleEnd);

    return `${start}${'*'.repeat(maskedLength)}${end}`;
};

export default BasicInformation;
