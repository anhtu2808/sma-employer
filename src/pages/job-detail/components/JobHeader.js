import React from 'react';
import JobSkills from './JobSkills';
import JobExpertise from './JobExpertise';

const JobHeader = ({ job, formatDate, formatSalary }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{job.name}</h1>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                        <span className="font-medium text-primary">{job.company?.name}</span>
                        <span>•</span>
                        <span>Posted {formatDate(job.uploadTime || job.createdAt)}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600 dark:text-gray-300 mb-6">
                <div className="flex items-center gap-1.5">
                    <span className="material-icons-round text-gray-400">place</span>
                    {job.company?.country || job.location || 'Vietnam'}
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="material-icons-round text-gray-400">domain</span>
                    {job.company?.companyIndustry?.replace(/_/g, ' ') || 'Unknown Industry'}
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="material-icons-round text-gray-400">payments</span>
                    <span className="font-medium text-orange-600 dark:text-orange-400">
                        {formatSalary(job.salaryStart, job.salaryEnd, job.currency)}
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="material-icons-round text-gray-400">work_outline</span>
                    {job.jobLevel}
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="material-icons-round text-gray-400">business</span>
                    {job.workingModel}
                </div>
                {job.expDate && (
                    <div className="flex items-center gap-1.5">
                        <span className="material-icons-round text-gray-400">event</span>
                        Deadline: {formatDate(job.expDate)}
                    </div>
                )}
            </div>

            <JobSkills skills={job.skills} />
            <JobExpertise expertise={job.expertise} />
        </div>
    );
};

export default JobHeader;
