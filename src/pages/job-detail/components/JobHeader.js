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

    const getStatusColor = (status) => {
        switch (status) {
            case 'PUBLISHED':
                return 'success';
            case 'DRAFT':
                return 'default';
            case 'PENDING_REVIEW':
                return 'warning';
            case 'SUSPENDED':
            case 'CLOSED':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusLabel = (status) => {
        const labels = {
            PUBLISHED: 'Published',
            DRAFT: 'Draft',
            PENDING_REVIEW: 'Pending Review',
            SUSPENDED: 'Suspended',
            CLOSED: 'Closed',
        };
        return labels[status] || status || 'Unknown';
    };

    return (
        <div className="pb-4">
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white m-0 leading-none">
                                {job.name}
                            </h1>
                            {/* {job.status && (
                                <Tag color={getStatusColor(job.status)} className="text-sm px-3 py-1 rounded-full m-0 border-none font-medium flex items-center">
                                    {getStatusLabel(job.status)}
                                </Tag>
                            )} */}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-semibold text-gray-900 dark:text-gray-100">{job.company?.name || 'Company Name'}</span>
                            <span>•</span>
                            <span>Posted {formatDate(job.createdAt || new Date().toISOString())}</span> {/* Note: Replace with actual creation date if available */}
                        </div>
                    </div>
                    <Button
                        mode="secondary"
                        onClick={onCloneJob}
                        iconLeft={<span className="material-icons-round text-sm">content_copy</span>}
                        className="shrink-0"
                    >
                        Clone Job
                    </Button>
                </div>

                {/* Meta Info Row */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <span className="material-icons-round text-gray-400 text-lg">place</span>
                        <span>{job.company?.country || 'Vietnam'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="material-icons-round text-gray-400 text-lg">payments</span>
                        <span className="font-semibold text-orange-500">
                            {formatSalary(job.salaryStart, job.salaryEnd, job.currency)}
                        </span>
                    </div>
                    {job.expDate && (
                        <div className="flex items-center gap-2">
                            <span className="material-icons-round text-gray-400 text-lg">event</span>
                            <span>Deadline: {formatDate(job.expDate)}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <span className="material-icons-round text-gray-400 text-lg">work</span>
                        <span className="capitalize">{job.quantity || 1} {job.jobLevel?.toLowerCase() || 'years experience'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="material-icons-round text-gray-400 text-lg">person</span>
                        <span className="capitalize">{job.jobLevel?.toLowerCase() || 'Junior'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="material-icons-round text-gray-400 text-lg">apartment</span>
                        <span className="uppercase">{job.workingModel || 'ONSITE'}</span>
                    </div>
                </div>



                {/* Expertise & Domain */}
                <div className="space-y-3 mt-2">
                    {job.expertise && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <span className="w-full sm:w-28 text-sm font-bold text-gray-900 dark:text-white shrink-0">Job Expertise:</span>
                            <Tag color="blue" className="px-3 py-1 text-sm rounded-full m-0 bg-blue-50 text-blue-600 border-none font-medium">
                                {job.expertise.name}
                            </Tag>
                        </div>
                    )}
                    {job.domains && job.domains.length > 0 && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-wrap">
                            <span className="w-full sm:w-28 text-sm font-bold text-gray-900 dark:text-white shrink-0">Job Domain:</span>
                            {job.domains.map((domain) => (
                                <Tag key={domain.id} color="success" className="px-3 py-1 text-sm rounded-full m-0 bg-green-50 text-green-600 border-none font-medium">
                                    {domain.name}
                                </Tag>
                            ))}
                        </div>
                    )}
                    {/* Skills */}
                    {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 flex-wrap">
                            <span className="w-full sm:w-28 text-sm font-bold text-gray-900 dark:text-white shrink-0 pt-1">Skills:</span>
                            <div className="flex-1">
                                <JobSkills skills={job.skills} />
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default JobHeader;
