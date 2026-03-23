import React from 'react';
import { Tag } from 'antd';

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
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Benefits</h3>
                    <ul className="space-y-3">
                        {job.benefits.map((benefit) => (
                            <li key={benefit.id} className="flex gap-3 text-gray-600 dark:text-gray-300 items-start">
                                <span className="material-icons-round text-orange-500 text-lg leading-7 shrink-0">check_circle</span>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        {benefit.type && (
                                            <span className="text-[10px] font-semibold text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded">
                                                {benefit.type.replace('_', ' ')}
                                            </span>
                                        )}
                                        <span className="text-gray-800 dark:text-gray-200 font-medium text-base">{benefit.name}</span>
                                    </div>
                                    {benefit.description && <p className="text-sm text-gray-500 dark:text-gray-400">{benefit.description}</p>}
                                </div>
                            </li>
                        ))}
                    </ul>
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
