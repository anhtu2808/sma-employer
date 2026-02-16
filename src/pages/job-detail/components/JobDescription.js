import React from 'react';
import JobSkills from './JobSkills';
import { Tag } from 'antd';

const JobDescription = ({ job }) => {
    return (
        <div className="space-y-8">
            <section>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">About the Role</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base whitespace-pre-wrap">
                    {job.about || job.description || "Great opportunity for learning and growth in a dynamic environment."}
                </p>
                {/* Expertise and Domains as Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {job.expertise && (
                        <Tag color="orange" className="px-3 py-1 text-sm rounded-full m-0">
                            {job.expertise.name}
                        </Tag>
                    )}
                    {job.domains && job.domains.map((domain) => (
                        <Tag key={domain.id} color="orange" className="px-3 py-1 text-sm rounded-full m-0">
                            {domain.name}
                        </Tag>
                    ))}
                </div>
            </section>

            <section>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Requirements</h3>
                <ul className="space-y-3">
                    {job.requirement ? (
                        job.requirement.split('\n').map((req, idx) => (
                            req.trim() && (
                                <li key={idx} className="flex gap-3 text-gray-600 dark:text-gray-300 items-start">
                                    <span className="material-icons-round text-orange-500 text-sm mt-1 shrink-0">check_circle_outline</span>
                                    <span>{req}</span>
                                </li>
                            )
                        ))
                    ) : (
                        <li className="text-gray-500 italic">No specific requirements listed.</li>
                    )}
                </ul>
            </section>

            {job.responsibilities && (
                <section>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Responsibilities</h3>
                    <ul className="space-y-3">
                        {job.responsibilities.split('\n').map((resp, idx) => (
                            resp.trim() && (
                                <li key={idx} className="flex gap-3 text-gray-600 dark:text-gray-300 items-start">
                                    <span className="material-icons-round text-orange-500 text-sm mt-1 shrink-0">check_circle_outline</span>
                                    <span>{resp}</span>
                                </li>
                            )
                        ))}
                    </ul>
                </section>
            )}

            {/* Benefits Section */}
            {job.benefits && job.benefits.length > 0 && (
                <section>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Benefits & Perks</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {job.benefits.map((benefit) => (
                            <div key={benefit.id} className="flex gap-3 items-start p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <span className="material-icons-round text-orange-500 mt-0.5">verified</span>
                                <div>
                                    <strong className="block text-gray-900 dark:text-white font-medium">{benefit.name}</strong>
                                    {benefit.description && <span className="text-sm text-gray-500 dark:text-gray-400">{benefit.description}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Questions Section */}
            {job.questions && job.questions.length > 0 && (
                <section>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Screening Questions</h3>
                    <ul className="space-y-3">
                        {job.questions.map((q, idx) => (
                            <li key={q.id} className="flex gap-3 text-gray-600 dark:text-gray-300 items-start">
                                <span className="material-icons-round text-orange-500 text-sm mt-1 shrink-0">help_outline</span>
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

            {/* Skills Section */}
            {job.skills && job.skills.length > 0 && (
                <section>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Skills Required</h3>
                    <JobSkills skills={job.skills} />
                </section>
            )}
        </div>
    );
};

export default JobDescription;
