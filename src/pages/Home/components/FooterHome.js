
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';

const Footer = () => {
    return (
        <footer className="bg-[#0f172a] text-white py-16 border-t border-white/10">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <Logo iconColor="white" className="text-white" />
                        </div>
                        <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                            AI-powered Resume Scoring Platform connecting top talent with leading companies.
                        </p>
                        <div className="flex gap-4">
                            {/* Social Icons Placeholder */}
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 5.06 3.66 9.29 8.35 10.04v-7.1H7.85v-2.94h2.5V9.77c0-2.47 1.48-3.86 3.7-3.86 1.05 0 2.15.19 2.15.19v2.36h-1.21c-1.22 0-1.6.75-1.6 1.54v1.85h2.64l-.42 2.94h-2.22v7.1C18.34 21.29 22 17.06 22 12c0-5.52-4.48-10-10-10z" /></svg>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">For Candidates</h4>
                        <ul className="space-y-3 text-sm text-neutral-400">
                            <li><a href="#" className="hover:text-primary transition-colors">Browse Jobs</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">CV Builder</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Career Tips</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Salary Guide</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">For Recruiters</h4>
                        <ul className="space-y-3 text-sm text-neutral-400">
                            <li><Link to="/register/recruiter" className="hover:text-primary transition-colors">Post a Job</Link></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Pricing Plans</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Search Talent</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Employer Branding</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-3 text-sm text-neutral-400">
                            <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 text-center text-neutral-500 text-sm">
                    © {new Date().getFullYear()} SmartRecruit. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
