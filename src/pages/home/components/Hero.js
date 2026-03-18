
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';

const Hero = () => {
    return (
        <section
            className="relative min-h-[85vh] flex items-center pt-40 pb-32 md:pt-52 md:pb-40 px-6 text-center bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/Background.png)` }}
        >
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative container mx-auto max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-20 text-white font-heading">
                    Welcome to <br /><span className="text-primary">SmartRecruit Employer</span>
                </h1>
                <p className="text-lg md:text-xl text-neutral-200 leading-relaxed font-body mb-10 max-w-2xl mx-auto">
                    AI-Powered IT Recruitment Platform for Employers. Streamline your hiring process and find the best talent faster.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button mode="primary" size="lg" className="min-w-[160px]" onClick={() => window.location.href = '/register/recruiter'}>
                        Get Started
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
