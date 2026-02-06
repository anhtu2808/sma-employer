
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import Logo from '@/components/Logo';

const Header = () => {
    return (
        <header className="w-full z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 sticky top-0">
            <div className="container mx-auto px-6 h-16 flex justify-between items-center relative">
                <div className="flex-shrink-0 z-10">
                    <Logo />
                </div>

                <nav className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Link to="/" className="text-sm font-medium text-primary">Home</Link>
                    <a href="#features" className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors">Features</a>
                    <Link to="/ui-kit" className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-primary transition-colors">UI Kit</Link>
                </nav>

                <div className="hidden md:block flex-shrink-0 z-10">
                    <Link to="/register/recruiter">
                        <Button mode="primary" shape="pill">
                            Recruiter Sign In
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
