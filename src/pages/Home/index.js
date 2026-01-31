import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button/index.tsx';

const Home = () => {
    return (
        <div className="min-h-screen bg-surface-light dark:bg-background-dark flex items-center justify-center">
            <div className="text-center max-w-2xl mx-auto px-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
                    SmartRecruit Employer
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-neutral-900 dark:text-white font-heading">
                    Welcome to SmartRecruit Employer
                </h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed font-body mb-8">
                    AI-Powered IT Recruitment Platform for Employers
                </p>
                <div className="flex gap-4 justify-center">
                    <Link to="/ui-kit">
                        <Button mode="primary">
                            View UI Kit
                        </Button>
                    </Link>
                    <Button mode="secondary">
                        Get Started
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Home;
