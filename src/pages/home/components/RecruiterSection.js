
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';

const RecruiterSection = () => {
    return (
        <section className="py-16 md:py-24 px-6 bg-surface-light dark:bg-neutral-800/20">
            <div className="container mx-auto max-w-6xl">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">

                    {/* Recruiter Card - Light Theme */}
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 md:p-12 shadow-xl hover:shadow-2xl transition-shadow flex flex-col relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-primary/10 transition-colors" />

                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
                            <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading text-neutral-900 dark:text-white">For Recruiters</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 text-lg mb-8 leading-relaxed">
                            Post jobs and find top talent using AI-powered candidate matching. Streamline your hiring process with smart analytics.
                        </p>

                        <ul className="space-y-4 mb-10 flex-grow text-neutral-600 dark:text-neutral-400">
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                AI-ranked candidate shortlists
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Smart JD-CV matching engine
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                Comprehensive hiring dashboard
                            </li>
                        </ul>

                        <Link to="/register/recruiter">
                            <Button mode="primary" shape="pill">
                                <div className="flex items-center justify-center gap-2">
                                    <span>Post a Job</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </div>
                            </Button>
                        </Link>
                    </div>

                    {/* Visual Dashboard Preview (Right Column) */}
                    <div className="relative hidden md:block">
                        {/* Decorative Blobs */}
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-[80px] -z-10 mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse" />
                        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-500/20 rounded-full blur-[60px] -z-10 mix-blend-multiply dark:mix-blend-screen opacity-70" />

                        {/* Main Stats Card */}
                        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-2xl border border-neutral-100 dark:border-neutral-800 relative z-10 transform hover:-translate-y-2 transition-transform duration-500">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <div className="text-sm text-neutral-500 font-medium">Total Candidates</div>
                                    <div className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">1,248</div>
                                </div>
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                </div>
                            </div>

                            {/* Mock Chart Area */}
                            <div className="h-32 flex items-end justify-between gap-2 px-1">
                                {[45, 65, 40, 75, 55, 80, 60, 90].map((h, i) => (
                                    <div key={i} className="w-full bg-primary/10 dark:bg-primary/20 rounded-t-lg relative group overflow-hidden" style={{ height: `${h}%` }}>
                                        <div className="absolute bottom-0 left-0 w-full bg-primary/80 h-0 transition-all duration-1000 group-hover:h-full" style={{ height: `${h}%` }}></div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex items-center justify-between text-xs text-neutral-400 font-medium">
                                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                            </div>
                        </div>

                        {/* Floating Card 1: Top Candidate */}
                        <div className="absolute -right-6 top-10 bg-white dark:bg-neutral-800 p-4 rounded-2xl shadow-lg border border-neutral-100 dark:border-neutral-700 w-48 animate-float-slow">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">JS</div>
                                <div>
                                    <div className="text-xs font-bold text-neutral-900 dark:text-white">John Smith</div>
                                    <div className="text-[10px] text-neutral-500">Senior Developer</div>
                                </div>
                            </div>
                            <div className="w-full bg-neutral-100 dark:bg-neutral-700 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-green-500 h-full w-[92%]"></div>
                            </div>
                            <div className="flex justify-between mt-1 text-[10px]">
                                <span className="text-neutral-500">Match Score</span>
                                <span className="font-bold text-green-500">92%</span>
                            </div>
                        </div>

                        {/* Floating Card 2: Hiring Velocity */}
                        <div className="absolute -left-6 bottom-20 bg-white dark:bg-neutral-800 p-4 rounded-2xl shadow-lg border border-neutral-100 dark:border-neutral-700 w-44 animate-float-delayed">
                            <div className="text-xs text-neutral-500 mb-1">Time to Hire</div>
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-bold text-neutral-900 dark:text-white">12</span>
                                <span className="text-xs text-neutral-500 mb-1">days</span>
                                <span className="text-xs text-green-500 font-bold mb-1 ml-auto">▼ 15%</span>
                            </div>
                            <div className="mt-2 text-[10px] text-neutral-400">vs. last month</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RecruiterSection;
