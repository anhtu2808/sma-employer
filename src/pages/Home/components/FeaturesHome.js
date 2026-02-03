
import React from 'react';
import Card from '@/components/Card';

const Features = () => {
    const features = [
        {
            title: "Easy CV Upload",
            description: "Upload your resume in PDF or DOCX format. Our system automatically extracts and organizes your information.",
            icon: (
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
            )
        },
        {
            title: "AI Resume Parsing",
            description: "Advanced NLP extracts skills, experience, and education from your CV into a structured format.",
            icon: (
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            )
        },
        {
            title: "Smart JD Matching",
            description: "Semantic analysis calculates precise match scores between your CV and job descriptions.",
            icon: (
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            title: "ATS Scoring",
            description: "Get an ATS-friendly score with detailed feedback on structure, keywords, and formatting.",
            icon: (
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            )
        },
        {
            title: "AI Suggestions",
            description: "Receive personalized recommendations to improve your CV and increase your match rate.",
            icon: (
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            )
        },
        {
            title: "Detailed Reports",
            description: "Recruiters get comprehensive analytics and candidate ranking dashboards.",
            icon: (
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        }
    ];

    return (
        <section id="features" className="py-20 bg-white/50 dark:bg-neutral-900/50">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-primary font-semibold text-sm tracking-uppercase mb-2 block tracking-wider uppercase">Features</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-6 font-heading">
                        AI-Powered Recruitment Tools
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                        Leverage cutting-edge AI technology to streamline your job search or find the perfect candidates faster than ever.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="h-full hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 font-heading">
                                {feature.title}
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
