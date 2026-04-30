import React, { useMemo } from 'react';
import Loading from '@/components/Loading';
import PdfViewer from '@/pages/application/detail/pdf-viewer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Sparkles } from 'lucide-react';
import {
    faArrowUpRightFromSquare,
    faBriefcase,
    faBuilding,
    faEnvelope,
    faFilePdf,
    faFolderOpen,
    faGraduationCap,
    faLink,
    faLinkSlash,
    faLocationDot,
    faPhone,
    faUser,
} from '@/utils/icons';

const PROFILE_RESUME_TYPE = 'PROFILE';

const ResumePreviewPanel = ({
    proposal,
    profileResume,
    isProfileResumeLoading = false,
    isProfileResumeError = false,
    profileResumeError,
}) => {
    const isProfileResume = proposal?.resumeType === PROFILE_RESUME_TYPE;

    if (isProfileResume) {
        if (isProfileResumeLoading) {
            return (
                <div className="flex h-full min-h-[720px] items-center justify-center">
                    <Loading size={96} className="py-0" />
                </div>
            );
        }

        if (isProfileResumeError || !profileResume) {
            return (
                <PreviewStateCard
                    title="Unable to load profile preview"
                    description={profileResumeError?.data?.message || profileResumeError?.message || 'The PROFILE resume details could not be loaded.'}
                />
            );
        }

        return <ProfileResumePreview resume={profileResume} />;
    }

    if (!proposal?.resumeUrl) {
        return (
            <PreviewStateCard
                title="Resume preview is unavailable"
                description="No file URL is available for this resume."
            />
        );
    }

    const fileType = getFileType(proposal?.resumeName, proposal?.resumeUrl);

    if (fileType === 'pdf') {
        return (
            <PdfViewer
                resumeUrl={proposal.resumeUrl}
                resumeName={proposal.resumeName}
                candidateName={proposal.candidateName}
            />
        );
    }

    return (
        <PreviewStateCard
            title="Preview is only available for PDF files"
            description={`${proposal?.resumeName || 'This resume'} cannot be rendered inline. Open the file in a new tab instead.`}
            action={(
                <a
                    href={proposal.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                >
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[14px]" />
                    Open file
                </a>
            )}
        />
    );
};

const ProfileResumePreview = ({ resume }) => {
    const skillGroups = useMemo(() => sortByOrderIndex(resume?.skillGroups), [resume?.skillGroups]);
    const experiences = useMemo(() => sortByOrderIndex(resume?.experiences), [resume?.experiences]);
    const educations = useMemo(() => sortByOrderIndex(resume?.educations), [resume?.educations]);
    const projects = useMemo(() => sortByOrderIndex(resume?.projects), [resume?.projects]);
    const certifications = useMemo(() => resume?.certifications ?? [], [resume?.certifications]);

    const contactItems = [
        resume?.emailInResume && { icon: faEnvelope, value: resume.emailInResume, href: `mailto:${resume.emailInResume}` },
        resume?.phoneInResume && { icon: faPhone, value: resume.phoneInResume, href: `tel:${resume.phoneInResume}` },
        resume?.addressInResume && { icon: faLocationDot, value: resume.addressInResume },
    ].filter(Boolean);

    const socialItems = [
        resume?.linkedinLink && { label: 'LinkedIn', value: resume.linkedinLink },
        resume?.githubLink && { label: 'GitHub', value: resume.githubLink },
        resume?.portfolioLink && { label: 'Portfolio', value: resume.portfolioLink },
    ].filter(Boolean);

    return (
        <div className="h-full overflow-y-auto bg-neutral-50 dark:bg-neutral-950">
            <div className="mx-auto flex max-w-5xl flex-col gap-5 p-5">
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="flex flex-col gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">Profile Resume</p>
                            <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                {resume?.fullName || resume?.resumeName || 'Candidate Profile'}
                            </h2>
                            <p className="mt-2 text-lg font-medium text-gray-500 dark:text-neutral-400">
                                {resume?.jobTitle || 'No job title provided'}
                            </p>
                        </div>

                        {contactItems.length > 0 && (
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {contactItems.map((item) => (
                                    <ContactChip key={`${item.icon.iconName}-${item.value}`} {...item} />
                                ))}
                            </div>
                        )}

                        {socialItems.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {socialItems.map((item) => (
                                    <ExternalLinkChip key={item.label} label={item.label} value={item.value} />
                                ))}
                            </div>
                        )}

                        {resume?.summary && (
                            <SectionCard icon={faUser} title="Summary">
                                <p className="whitespace-pre-line text-sm leading-7 text-gray-700 dark:text-neutral-300">
                                    {resume.summary}
                                </p>
                            </SectionCard>
                        )}
                    </div>
                </section>

                {skillGroups.length > 0 && (
                    <SectionCard icon={<Sparkles size={18} />} title="Skills">
                        <div className="space-y-4">
                            {skillGroups.map((group) => (
                                <div key={group?.id || group?.name}>
                                    <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                                        {group?.name || 'Ungrouped'}
                                    </h3>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {(group?.skills ?? []).map((skill) => (
                                            <span
                                                key={skill?.id || `${group?.name}-${skill?.skillId}`}
                                                className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                                            >
                                                {skill?.skillName || 'Skill'}
                                                {skill?.yearsOfExperience != null ? ` (${skill.yearsOfExperience} yrs)` : ''}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                )}

                {experiences.length > 0 && (
                    <SectionCard icon={faBriefcase} title="Work Experience">
                        <div className="space-y-5">
                            {experiences.map((experience) => (
                                <div key={experience?.id || `${experience?.company}-${experience?.startDate}`} className="rounded-xl border border-gray-100 p-4 dark:border-neutral-800">
                                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {experience?.company || 'Company'}
                                            </h3>
                                            <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-500 dark:text-neutral-400">
                                                {experience?.employmentType && <MetaBadge value={formatEnumLabel(experience.employmentType)} />}
                                                {experience?.workingModel && <MetaBadge value={formatEnumLabel(experience.workingModel)} />}
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-500 dark:text-neutral-400">
                                            {formatDateRange(experience?.startDate, experience?.endDate, experience?.isCurrent)}
                                        </span>
                                    </div>

                                    {(experience?.details ?? []).length > 0 && (
                                        <div className="mt-4 space-y-4 border-t border-gray-100 pt-4 dark:border-neutral-800">
                                            {sortByOrderIndex(experience?.details).map((detail) => (
                                                <div key={detail?.id || `${detail?.title}-${detail?.startDate}`}>
                                                    <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                                                        <h4 className="text-base font-semibold text-gray-800 dark:text-neutral-200">
                                                            {detail?.title || 'Role'}
                                                        </h4>
                                                        <span className="text-xs text-gray-500 dark:text-neutral-400">
                                                            {formatDateRange(detail?.startDate, detail?.endDate, detail?.isCurrent)}
                                                        </span>
                                                    </div>
                                                    {detail?.description && (
                                                        <p className="mt-2 whitespace-pre-line text-sm leading-7 text-gray-700 dark:text-neutral-300">
                                                            {detail.description}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                )}

                {educations.length > 0 && (
                    <SectionCard icon={faGraduationCap} title="Education">
                        <div className="space-y-4">
                            {educations.map((education) => (
                                <div key={education?.id || `${education?.institution}-${education?.startDate}`} className="rounded-xl border border-gray-100 p-4 dark:border-neutral-800">
                                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {education?.institution || 'Institution'}
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-600 dark:text-neutral-300">
                                                {[formatEnumLabel(education?.degree), education?.majorField].filter(Boolean).join(' - ') || 'Education details'}
                                            </p>
                                            {education?.gpa != null && (
                                                <p className="mt-2 text-sm font-medium text-gray-500 dark:text-neutral-400">
                                                    GPA: {education.gpa}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-500 dark:text-neutral-400">
                                            {formatDateRange(education?.startDate, education?.endDate, education?.isCurrent)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                )}

                {projects.length > 0 && (
                    <SectionCard icon={faFolderOpen} title="Projects">
                        <div className="space-y-4">
                            {projects.map((project) => (
                                <div key={project?.id || `${project?.title}-${project?.startDate}`} className="rounded-xl border border-gray-100 p-4 dark:border-neutral-800">
                                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {project?.title || 'Project'}
                                            </h3>
                                            <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-500 dark:text-neutral-400">
                                                {project?.position && <MetaBadge value={project.position} />}
                                                {project?.projectType && <MetaBadge value={formatEnumLabel(project.projectType)} />}
                                                {project?.teamSize != null && <MetaBadge value={`Team ${project.teamSize}`} />}
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-500 dark:text-neutral-400">
                                            {formatDateRange(project?.startDate, project?.endDate, project?.isCurrent)}
                                        </span>
                                    </div>
                                    {project?.description && (
                                        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-700 dark:text-neutral-300">
                                            {project.description}
                                        </p>
                                    )}
                                    {project?.projectUrl && (
                                        <div className="mt-3">
                                            <ExternalLinkChip label="Project link" value={project.projectUrl} />
                                        </div>
                                    )}
                                    {(project?.skills ?? []).length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {project.skills.map((skill) => (
                                                <span
                                                    key={skill?.id || `${project?.id}-${skill?.skillId}`}
                                                    className="rounded-full bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                                                >
                                                    {skill?.skillName || 'Skill'}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                )}

                {certifications.length > 0 && (
                    <SectionCard icon={faBuilding} title="Certifications">
                        <div className="space-y-4">
                            {certifications.map((certification) => (
                                <div key={certification?.id || certification?.name} className="rounded-xl border border-gray-100 p-4 dark:border-neutral-800">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {certification?.name || 'Certification'}
                                    </h3>
                                    {certification?.issuer && (
                                        <p className="mt-1 text-sm text-gray-600 dark:text-neutral-300">
                                            Issued by {certification.issuer}
                                        </p>
                                    )}
                                    {certification?.description && (
                                        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-700 dark:text-neutral-300">
                                            {certification.description}
                                        </p>
                                    )}
                                    {certification?.credentialUrl && (
                                        <div className="mt-3">
                                            <ExternalLinkChip label="Credential" value={certification.credentialUrl} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                )}
            </div>
        </div>
    );
};

const SectionCard = ({ icon, title, children }) => (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-900/20">
                {React.isValidElement(icon) ? icon : <FontAwesomeIcon icon={icon} />}
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>
        {children}
    </section>
);

const PreviewStateCard = ({ title, description, action }) => (
    <div className="mx-auto flex h-full min-h-[720px] w-full max-w-[920px] items-center justify-center px-6 py-8">
        <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <FontAwesomeIcon icon={faFilePdf} className="text-5xl text-gray-300 dark:text-neutral-600" />
            <h2 className="mt-5 text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-neutral-400">{description}</p>
            {action ? <div className="mt-5">{action}</div> : null}
        </div>
    </div>
);

const ContactChip = ({ icon, value, href }) => {
    const content = (
        <span className="truncate text-sm font-medium text-gray-700 dark:text-neutral-200">
            {value}
        </span>
    );

    return (
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/60">
            <FontAwesomeIcon icon={icon} className="text-gray-400" />
            {href ? (
                <a href={href} className="min-w-0 hover:text-orange-500">
                    {content}
                </a>
            ) : (
                content
            )}
        </div>
    );
};

const ExternalLinkChip = ({ label, value }) => {
    const normalizedHref = normalizeLink(value);

    if (!normalizedHref) {
        return (
            <span className="inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-500 dark:border-neutral-700 dark:text-neutral-400">
                <FontAwesomeIcon icon={faLinkSlash} />
                {label}
            </span>
        );
    }

    return (
        <a
            href={normalizedHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:border-orange-300 hover:text-orange-500 dark:border-neutral-800 dark:bg-neutral-800/60 dark:text-neutral-200"
        >
            <FontAwesomeIcon icon={faLink} />
            {label}
        </a>
    );
};

const MetaBadge = ({ value }) => (
    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-neutral-800 dark:text-neutral-300">
        {value}
    </span>
);

const getFileType = (fileName, url) => {
    const name = `${fileName || url || ''}`.toLowerCase();
    if (name.match(/\.pdf($|[?#])/)) return 'pdf';
    if (name.match(/\.docx?($|[?#])/)) return 'docx';
    return 'unknown';
};

const sortByOrderIndex = (items = []) => (
    [...(items || [])].sort((first, second) => {
        const firstOrder = Number.isFinite(Number(first?.orderIndex)) ? Number(first.orderIndex) : Number.MAX_SAFE_INTEGER;
        const secondOrder = Number.isFinite(Number(second?.orderIndex)) ? Number(second.orderIndex) : Number.MAX_SAFE_INTEGER;
        if (firstOrder !== secondOrder) return firstOrder - secondOrder;
        return (first?.id ?? 0) - (second?.id ?? 0);
    })
);

const formatEnumLabel = (value) => String(value || '')
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(' ');

const formatDate = (value) => {
    if (!value) return null;
    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) return String(value);
    return parsedDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
};

const formatDateRange = (startDate, endDate, isCurrent) => {
    const start = formatDate(startDate) || 'Unknown';
    if (isCurrent) return `${start} - Present`;
    return `${start} - ${formatDate(endDate) || 'Present'}`;
};

const normalizeLink = (value) => {
    if (!value) return null;
    if (/^https?:\/\//i.test(value)) return value;
    return `https://${value}`;
};

export default ResumePreviewPanel;
