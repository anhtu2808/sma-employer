
import React from 'react';
import Card from '@/components/Card';

const challenges = [
    {
        title: "Screening Too Many Unqualified CVs",
        description: "Recruiters spend hours manually reviewing hundreds of resumes, most of which don't meet the job requirements, leading to wasted time and delayed hiring.",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
    {
        title: "Difficulty Finding the Right IT Talent",
        description: "The IT job market is highly competitive. Finding candidates with the exact technical skills, experience level, and domain expertise is extremely challenging.",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        ),
    },
    {
        title: "Slow & Inconsistent Evaluation Process",
        description: "Manual candidate evaluation is subjective and inconsistent across team members, resulting in missed top talent and biased hiring decisions.",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
];

const solutions = [
    {
        title: "AI-Powered CV Screening",
        description: "Our AI automatically parses, scores, and ranks every CV against your job description — filtering out unqualified candidates instantly and surfacing the best matches.",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        ),
    },
    {
        title: "Smart Candidate Matching",
        description: "Semantic analysis matches candidates based on skills, expertise, domain, and experience — so you receive precisely matched candidate recommendations for every job posting.",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
    },
    {
        title: "Standardized AI Evaluation",
        description: "Every candidate is evaluated consistently using the same AI criteria — eliminating human bias and ensuring fair, data-driven hiring decisions across your entire team.",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
    },
];

const Challenges = () => {
    return (
        <section className="py-20 bg-neutral-50 dark:bg-neutral-800/30">
            <div className="container mx-auto px-6 max-w-6xl">

                {/* Challenges */}
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-6 font-heading">
                        Challenges Recruiters Face
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                        3 common challenges that every employer faces when searching for top IT talent:
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-24">
                    {challenges.map((item, index) => (
                        <Card key={index} className="h-full border-red-200/50 dark:border-red-900/30 bg-white dark:bg-neutral-800 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center mb-5 text-red-500 group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-3 font-heading">
                                {item.title}
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                                {item.description}
                            </p>
                        </Card>
                    ))}
                </div>

                {/* Arrow separator */}
                <div className="flex justify-center mb-24">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-bounce">
                        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>

                {/* Solutions */}
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-6 font-heading">
                        SmartRecruit's Solutions
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                        Our AI-powered platform solves each of these challenges so you can hire smarter and faster:
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                    {solutions.map((item, index) => (
                        <Card key={index} className="h-full border-primary/20 dark:border-primary/30 bg-white dark:bg-neutral-800 hover:shadow-lg hover:border-primary/40 transition-all duration-300 group">
                            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-5 text-primary group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-3 font-heading">
                                {item.title}
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                                {item.description}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Challenges;
