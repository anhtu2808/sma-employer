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

const CopyableField = ({ icon, label, value, href }) => {
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

const BasicInformation = ({
    app,
    onSwitchToAiTab,
    metaTitle = 'Application Info',
    metaItems,
    showDecisionHistory = true,
    hideCandidateSummary = false,
    hideLocationInContact = false,
    emphasizeMeta = false,
}) => {
    const [openAccordionKey, setOpenAccordionKey] = useState('about');

    const statusConfig = app.status
        ? getApplicationStatusConfig(app.status)
        : { label: 'N/A', textColor: 'text-gray-500' };

    const hasAnswers = app.answers?.length > 0;
    const hasSummary = !!app.aiEvaluation?.summary;
    const hasStrengths = !!app.aiEvaluation?.strengths;
    const hasWeakness = !!app.aiEvaluation?.weakness;
    const hasAccordion = hasAnswers || hasSummary || hasStrengths || hasWeakness;
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
        hasSummary && {
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
        hasStrengths && {
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
        hasWeakness && {
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
                                    <CopyableField icon={faPhone} label="Phone Number" value={app.candidatePhone} href={`tel:${app.candidatePhone}`} />
                                )}
                                {app.candidateEmail && (
                                    <CopyableField icon={faEnvelope} label="Email" value={app.candidateEmail} href={`mailto:${app.candidateEmail}`} />
                                )}
                                {!hideLocationInContact && app.location && (
                                    <CopyableField icon={faLocationDot} label="Address" value={app.location} />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Social Links */}
            {hasSocialLinks && (
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

export default BasicInformation;
