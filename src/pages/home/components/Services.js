
import React from 'react';
import Button from '@/components/Button';

const services = [
    {
        title: "Post Job",
        description: "Publish your job listings to reach thousands of qualified IT candidates. Our AI-powered platform ensures your jobs get maximum visibility and attract the right talent.",
        highlights: [
            "Reach thousands of IT professionals",
            "AI-optimized job descriptions for better visibility",
            "Manage and track all your job postings easily",
        ],
        image: `${process.env.PUBLIC_URL}/post_job_illustration.png`,
        link: "/register/recruiter",
        buttonText: "Post a Job",
    },
    {
        title: "Proposed CV",
        description: "Receive AI-curated candidate profiles that match your job requirements. Our smart matching engine analyzes skills, experience, and culture fit to recommend the best candidates.",
        highlights: [
            "AI-powered candidate matching & ranking",
            "Save time with pre-screened candidate profiles",
            "Find the perfect fit faster with smart filters",
        ],
        image: `${process.env.PUBLIC_URL}/proposed_cv_illustration.png`,
        link: "/register/recruiter",
        buttonText: "Browse Candidates",
    },
];

const Services = () => {
    return (
        <section id="services" className="py-20 bg-white dark:bg-neutral-900">
            <div className="container mx-auto px-6 max-w-6xl">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-6 font-heading">
                        Our Services
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                        We provide powerful recruitment services to help employers connect with top IT talent faster and more efficiently.
                    </p>
                </div>

                {/* Service Items */}
                <div className="flex flex-col gap-24">
                    {services.map((service, index) => {
                        const isReversed = index % 2 !== 0;
                        return (
                            <div
                                key={index}
                                className={`flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 lg:gap-20`}
                            >
                                {/* Image */}
                                <div className="w-full md:w-1/2">
                                    <div className="relative group">
                                        <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-orange-300/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <img
                                            src={service.image}
                                            alt={service.title}
                                            className="relative w-full rounded-2xl shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
                                        />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="w-full md:w-1/2">
                                    <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-4 font-heading">
                                        {service.title}
                                    </h3>
                                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                                        {service.description}
                                    </p>
                                    <ul className="space-y-3 mb-8">
                                        {service.highlights.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-neutral-700 dark:text-neutral-300">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button
                                        mode="primary"
                                        size="lg"
                                        className="min-w-[160px]"
                                        onClick={() => window.location.href = service.link}
                                    >
                                        {service.buttonText}
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Services;
