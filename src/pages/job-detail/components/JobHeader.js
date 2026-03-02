import React from 'react';
import { Tag, Dropdown, message } from 'antd';
import JobSkills from './JobSkills';
import Button from '@/components/Button';
import { useUpdateJobStatusMutation } from '@/apis/jobApi';

const JobHeader = ({ job, formatDate, formatSalary, onCloneJob, onCloseJob, onEditExpDate, isClosingJob }) => {
    const getInitials = (name) => {
        return name
            ? name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)
            : 'JB';
    };
 
    return (
        <div className="border-b border-gray-100 dark:border-gray-700 pb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Company Logo / Placeholder */}
                <div className="w-16 h-16 rounded-xl bg-gray-900 text-white flex items-center justify-center text-2xl font-bold shrink-0 shadow-sm">
                    {getInitials(job.company?.name || job.name)}
                </div>

                <div className="flex-1 w-full">
                    {/* Title Row */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <div>
                            <div className="flex items-center gap-3 flex-wrap mb-2">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                    {job.name}
                                    {job.status && (
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                            job.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                                            job.status === 'CLOSED' ? 'bg-red-100 text-red-700' :
                                            job.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {job.status}
                                        </span>
                                    )}
                                </h1>
                                <span className="text-gray-400 text-xl hidden md:inline">|</span>
                                <span className="text-gray-500 font-medium">
                                    {job.company?.name || 'Company Name'}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2 flex-wrap shrink-0">
                            {job.status === 'PUBLISHED' && (
                                <Button
                                    mode="danger"
                                    size="sm"
                                    iconLeft={<span className="material-icons-round text-sm">block</span>}
                                    onClick={onCloseJob}
                                    isLoading={isClosingJob}
                                >
                                    Close Job
                                </Button>
                            )}
                            <Button
                                mode="secondary"
                                size="sm"
                                iconLeft={<span className="material-icons-round text-sm">content_copy</span>}
                                onClick={onCloneJob}
                            >
                                Clone Job
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Meta Info Row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                    <span className="material-icons-round text-orange-500 text-base">place</span>
                    <span>{job.company?.country || 'Vietnam'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="material-icons-round text-orange-500 text-base">payments</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                        {formatSalary(job.salaryStart, job.salaryEnd, job.currency)}
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="material-icons-round text-orange-500 text-base">stars</span>
                    <span className="capitalize">{job.jobLevel?.toLowerCase()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="material-icons-round text-orange-500 text-base">apartment</span>
                    <span className="uppercase">{job.workingModel}</span>
                </div>
                {job.expDate && (
                    <div className="flex items-center gap-1.5">
                        <span className="material-icons-round text-orange-500 text-base">event</span>
                        <span>Deadline: {formatDate(job.expDate)}</span>
                    </div>
                )}
                {job.quantity && (
                    <div className="flex items-center gap-1.5">
                        <span className="material-icons-round text-orange-500 text-base">group</span>
                        <span>{job.quantity} {job.quantity > 1 ? 'positions' : 'position'}</span>
                    </div>
                )}
            </div>

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
                <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Skills:</p>
                    <JobSkills skills={job.skills} />
                </div>
            )}

            {/* Expertise & Domain */}
            <div className="space-y-3">
                {job.expertise && (
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 shrink-0">Job Expertise:</span>
                        <Tag color="blue" className="px-3 py-0.5 text-sm rounded-full m-0">
                            {job.expertise.name}
                        </Tag>
                    </div>
                )}
                {job.domains && job.domains.length > 0 && (
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 shrink-0">Job Domain:</span>
                        {job.domains.map((domain) => (
                            <Tag key={domain.id} color="blue" className="px-3 py-0.5 text-sm rounded-full m-0">
                                {domain.name}
                            </Tag>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default JobHeader;
