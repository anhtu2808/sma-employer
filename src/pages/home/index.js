
import React from 'react';

import Hero from './components/Hero';
import Features from './components/FeaturesHome';
import RecruiterSection from './components/RecruiterSectionHome';
import Footer from './components/FooterHome';
import Header from './components/HeaderHome';

const Home = () => {
    return (
        <div className="min-h-screen bg-surface-light dark:bg-background-dark flex flex-col font-sans text-neutral-900 dark:text-white">
            {/* Dynamic Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
            </div>

            <Header />

            <main className="flex-grow w-full">
                <Hero />
                <Features />
                <RecruiterSection />
            </main>

            <Footer />
        </div>
    );
};

export default Home;
