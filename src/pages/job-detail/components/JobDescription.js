import React from 'react';
import { Tag } from 'antd';

const JobDescription = ({ job }) => {
    return (
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {/* About the Role */}
            <section className="pb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">About the Role</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base whitespace-pre-wrap">
                    {job.about || job.description || "No description provided."}
                </p>
            </section>

            {/* Responsibilities */}
            {job.responsibilities && (
                <section className="py-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Responsibilities</h3>
                    <ul className="space-y-3">
                        {job.responsibilities.split('\n').map((resp, idx) => (
                            resp.trim() && (
                                <li key={idx} className="flex gap-3 text-gray-600 dark:text-gray-300 items-start">
                                    <span className="material-icons-round text-orange-500 text-lg leading-6 shrink-0">check_circle</span>
                                    <span>{resp}</span>
                                </li>
                            )
                        ))}
                    </ul>
                </section>
            )}

            {/* Requirements */}
            <section className="py-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Requirements</h3>
                <ul className="space-y-3">
                    {job.requirement ? (
                        job.requirement.split('\n').map((req, idx) => (
                            req.trim() && (
                                <li key={idx} className="flex gap-3 text-gray-600 dark:text-gray-300 items-start">
                                    <span className="material-icons-round text-orange-500 text-lg leading-6 shrink-0">check_circle</span>
                                    <span>{req}</span>
                                </li>
                            )
                        ))
                    ) : (
                        <li className="text-gray-500 italic">No specific requirements listed.</li>
                    )}
                </ul>
            </section>

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
                <section className="py-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Benefits & Perks</h3>
                    <ul className="space-y-3">
                        {job.benefits.map((benefit) => (
                            <li key={benefit.id} className="flex gap-3 text-gray-600 dark:text-gray-300 items-start">
                                <span className="material-icons-round text-orange-500 text-lg leading-6 shrink-0">check_circle</span>
                                <span>{benefit.name}{benefit.description ? ` - ${benefit.description}` : ''}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Screening Questions */}
            {job.questions && job.questions.length > 0 && (
                <section className="pt-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Screening Questions</h3>
                    <ul className="space-y-3">
                        {job.questions.map((q) => (
                            <li key={q.id} className="flex gap-3 text-gray-600 dark:text-gray-300 items-start">
                                <span className="material-icons-round text-orange-500 text-lg leading-6 shrink-0">help_outline</span>
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-gray-200">{q.question}</p>
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
