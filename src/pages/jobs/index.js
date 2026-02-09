import React, { useEffect, useState } from 'react';
import { useGetJobsQuery } from '@/apis/apis';
import JobListItem from '@/components/JobListItem';
import Button from '@/components/Button';
import { useNavigate } from 'react-router-dom';

const JobsList = () => {
    const navigate = useNavigate();
    const { data: jobsData, isLoading: isJobsLoading } = useGetJobsQuery({});

    if (isJobsLoading) {
        return <div className="p-6">Loading...</div>;
    }

    const jobs = jobsData?.data?.content || []; // Assuming paginated response with content

    const formatDate = (dateString, addDays = 0) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (addDays) {
            date.setDate(date.getDate() + addDays);
        }
        return date.toLocaleDateString();
    };

    const formatSalary = (min, max, currency = 'VND') => {
        if (!min && !max) return 'Negotiable';
        const format = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency }).format(num);
        if (min && !max) return `From ${format(min)}`;
        if (!min && max) return `Up to ${format(max)}`;
        return `${format(min)} - ${format(max)}`;
    };

    return (
        <div className="p-6 space-y-6">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Jobs</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your job postings</p>
                </div>
                <Button
                    mode="primary"
                    onClick={() => navigate('/jobs/create')}
                    iconLeft={<span className="material-icons-round">add</span>}
                >
                    Post a Job
                </Button>
            </header>

            {jobs.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-icons-round text-gray-400 text-3xl">work_outline</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No jobs posted yet</h3>
                    <p className="text-gray-500 mt-1 mb-6">Create your first job posting to start hiring.</p>
                    <Button
                        mode="primary"
                        onClick={() => navigate('/jobs/create')}
                    >
                        Post a Job
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {jobs.map((job) => (
                        <JobListItem
                            key={job.id}
                            title={job.name}
                            status={job.status || 'Active'}
                            postedTime={formatDate(job.uploadTime || job.createdAt)}
                            location={job.company?.country || job.workingModel}
                            salary={formatSalary(job.salaryStart, job.salaryEnd, job.currency)}
                            expiry={job.expDate ? `Ends on ${new Date(job.expDate).toLocaleDateString()}` : ''}
                            tags={[
                                job.jobLevel,
                                job.workingModel,
                                ...(job.skills || []).map(s => s.name)
                            ].filter(Boolean)}
                            stats={{
                                // API doesn't seem to return stats in the snippet, so we'll leave them undefined or handle if available
                                applicants: job.applicantsCount,
                                views: job.viewsCount,
                            }}
                            onViewDetails={() => navigate(`/jobs/${job.id}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
export default JobsList;
