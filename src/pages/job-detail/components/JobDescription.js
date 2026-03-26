import React from 'react';
import { Tag } from 'antd';
import {
    DollarSign, ShieldCheck, CalendarOff, Clock, GraduationCap,
    Coffee, Monitor, Building2, Trees, MoreHorizontal
} from 'lucide-react';

const BENEFIT_ICONS = {
    FINANCIAL: DollarSign,
    INSURANCE: ShieldCheck,
    TIME_OFF: CalendarOff,
    FLEXIBILITY: Clock,
    DEVELOPMENT: GraduationCap,
    LEISURE: Coffee,
    EQUIPMENT: Monitor,
    AMENITIES: Building2,
    WORK_ENVIRONMENT: Trees,
    OTHER: MoreHorizontal,
};

const JobDescription = ({ job }) => {
    return (
        <div className="space-y-6">
            {/* About the Role */}
            <section>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">About the Role</h3>
                <div
                    className="text-gray-600 dark:text-gray-300 leading-relaxed text-base prose-content"
                    dangerouslySetInnerHTML={{ __html: job.about || job.description || "<p>No description provided.</p>" }}
                />
            </section>

            {/* Responsibilities */}
            {job.responsibilities && (
                <section>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Responsibilities</h3>
                    <div
                        className="text-gray-600 dark:text-gray-300 leading-relaxed text-base prose-content"
                        dangerouslySetInnerHTML={{ __html: job.responsibilities }}
                    />
                </section>
            )}

            {/* Requirements */}
            <section>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Requirements</h3>
                {job.requirement ? (
                    <div
                        className="text-gray-600 dark:text-gray-300 leading-relaxed text-base prose-content"
                        dangerouslySetInnerHTML={{ __html: job.requirement }}
                    />
                ) : (
                    <p className="text-gray-500 italic">No specific requirements listed.</p>
                )}
            </section>

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
                <section>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">What We Can Offer</h3>
                    <div className="space-y-3">
                        {job.benefits.map((benefit) => {
                            const Icon = BENEFIT_ICONS[benefit.type] || MoreHorizontal;
                            return (
                                <div key={benefit.id} className="flex items-start gap-3 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <div className="shrink-0 w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                                        <Icon className="w-[18px] h-[18px] text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">{benefit.name}</p>
                                        {benefit.description && benefit.description !== benefit.name && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{benefit.description}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Screening Questions */}
            {job.questions && job.questions.length > 0 && (
                <section>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Questions</h3>
                    <ul className="space-y-3">
                        {job.questions.map((q) => (
                            <li key={q.id} className="flex gap-3 text-gray-600 dark:text-gray-300 items-start">
                                <span className="material-icons-round text-orange-500 text-lg leading-7 shrink-0">help_outline</span>
                                <div>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base whitespace-pre-wrap">{q.question}</p>
                                    {q.description && <p className="text-sm text-gray-500 mt-1">{q.description}</p>}
                                    {q.isRequired && <Tag color="error" className="mt-1 text-xs">Required</Tag>}
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
};

export default JobDescription;
