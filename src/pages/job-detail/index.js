import React, { useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetJobDetailQuery } from '@/apis/apis';
import Button from '@/components/Button';
import { Skeleton, Tag } from 'antd';
import JobHeader from './components/JobHeader';
import JobDescription from './components/JobDescription';
import { PageHeaderContext } from '@/contexts/PageHeaderContext';

const INDUSTRY_LABELS = {
    INFORMATION_TECHNOLOGY: 'Information Technology',
    FINANCE: 'Finance',
    MARKETING: 'Marketing',
    CONSTRUCTION: 'Construction',
    EDUCATION: 'Education',
    HEALTHCARE: 'Healthcare',
    OTHER: 'Other',
};

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setHeaderConfig } = useContext(PageHeaderContext);
    const { data: jobData, isLoading, error } = useGetJobDetailQuery(id);
    const job = jobData?.data;

    useEffect(() => {
        if (job?.name) {
            setHeaderConfig({ title: job.name, description: 'Job details and applicants' });
        }
        return () => setHeaderConfig({ title: 'Jobs', description: 'Manage your job postings' });
    }, [job?.name, setHeaderConfig]);

    if (isLoading) {
        return <div className="p-8"><Skeleton active /></div>;
    }

    if (error || !job) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-semibold mb-4">Job not found</h2>
                <Button onClick={() => navigate('/jobs')}>Back to Jobs</Button>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString();
    };

    const formatSalary = (min, max, currency = 'VND') => {
        if (!min && !max) return 'Negotiable';
        const formatter = (num) => {
            return new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(num);
        };
        const suffix = currency || 'VND';
        if (min && !max) return `From ${formatter(min)} ${suffix}`;
        if (!min && max) return `Up to ${formatter(max)} ${suffix}`;
        return `${formatter(min)} - ${formatter(max)} ${suffix}`;
    };

    const getInitials = (name) => {
        return name
            ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
            : 'CO';
    };

    return (
        <div className="w-full max-w-[95%] mx-auto space-y-4">
            {/* Back button */}
            <Button
                mode="text"
                className="text-gray-500 hover:text-primary pl-0 -ml-6"
                onClick={() => navigate('/jobs')}
                iconLeft={<span className="material-icons-round text-lg">arrow_back</span>}
            >
                Back to Jobs
            </Button>

            {/* Two-column layout */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Content - Left Column */}
                <div className="flex-1 min-w-0 space-y-6">
                    {/* Job Header Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 md:p-8">
                        <JobHeader job={job} formatDate={formatDate} formatSalary={formatSalary} />
                    </div>

                    {/* Job Description Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 md:p-8">
                        <JobDescription job={job} />
                    </div>
                </div>

                {/* Sidebar - Right Column */}
                <div className="w-full lg:w-80 shrink-0 space-y-6">
                    {/* Company Info Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-lg font-bold text-gray-600 dark:text-gray-300 shrink-0">
                                {job.company?.logo ? (
                                    <img src={job.company.logo} alt={job.company.name} className="w-full h-full rounded-lg object-cover" />
                                ) : (
                                    getInitials(job.company?.name)
                                )}
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug">
                                    {job.company?.name || 'Company Name'}
                                </h3>
                                {job.company?.link && (
                                    <a
                                        href={job.company.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline text-sm flex items-center gap-1 mt-1"
                                    >
                                        {job.company.link.replace(/^https?:\/\/(www\.)?/, '')}
                                        <span className="material-icons-round text-sm">open_in_new</span>
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Location</span>
                                <span className="font-medium text-gray-900 dark:text-white">{job.company?.country || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Industry</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {INDUSTRY_LABELS[job.company?.companyIndustry] || job.company?.companyIndustry || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Similar Jobs Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Similar Jobs</h3>
                        <p className="text-sm text-gray-400 text-center py-4">
                            Similar jobs will be shown here
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetail;
