
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';

const Hero = () => {
    return (
        <section className="pt-24 pb-12 md:pt-32 md:pb-16 px-6 text-center bg-gradient-to-b from-primary/5 via-primary/5 to-transparent">
            <div className="container mx-auto max-w-4xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
                    SmartRecruit Employer
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-neutral-900 dark:text-white font-heading">
                    Welcome to SmartRecruit Employer
                </h1>
                <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed font-body mb-10 max-w-2xl mx-auto">
                    AI-Powered IT Recruitment Platform for Employers. Streamline your hiring process and find the best talent faster.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link to="/ui-kit">
                        <Button mode="primary" size="lg" className="min-w-[160px]">
                            View UI Kit
                        </Button>
                    </Link>
                    <Link to="/register/recruiter">
                        <Button mode="outline" size="lg" className="min-w-[160px]">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;
