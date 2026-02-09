import React from 'react';

const JobDescription = ({ job }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-8">
            <section>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">About the Role</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {job.description || "Great opportunity for learning and growth in a dynamic environment."}
                </p>
            </section>

            <section>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Responsibilities</h3>
                <ul className="space-y-2">
                    <li className="flex gap-2 text-gray-600 dark:text-gray-300">
                        <span className="material-icons-round text-orange-500 text-sm mt-1">check_circle</span>
                        <span>Maintain existing codebase and implement new features.</span>
                    </li>
                    <li className="flex gap-2 text-gray-600 dark:text-gray-300">
                        <span className="material-icons-round text-orange-500 text-sm mt-1">check_circle</span>
                        <span>Collaborate with cross-functional teams to define, design, and ship new features.</span>
                    </li>
                </ul>
            </section>

            <section>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Requirements</h3>
                <ul className="space-y-2">
                    <li className="flex gap-2 text-gray-600 dark:text-gray-300">
                        <span className="material-icons-round text-green-500 text-sm mt-1">check_circle_outline</span>
                        <span>1+ years of experience in Java development.</span>
                    </li>
                    <li className="flex gap-2 text-gray-600 dark:text-gray-300">
                        <span className="material-icons-round text-green-500 text-sm mt-1">check_circle_outline</span>
                        <span>Strong understanding of object-oriented programming.</span>
                    </li>
                </ul>
            </section>

            {job.benefits && job.benefits.length > 0 && (
                <section>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Benefits & Perks</h3>
                    <ul className="space-y-2">
                        {job.benefits.map((benefit) => (
                            <li key={benefit.id} className="flex gap-2 text-gray-600 dark:text-gray-300">
                                <span className="material-icons-round text-orange-500 text-sm mt-1">verified</span>
                                <span><strong>{benefit.name}</strong>: {benefit.description}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
};

export default JobDescription;
