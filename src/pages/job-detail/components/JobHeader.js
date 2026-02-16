import React from 'react';
import Button from '@/components/Button';

const JobHeader = ({ job, formatDate, formatSalary }) => {
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
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {job.name}
                                </h1>
                                <span className="text-gray-400 text-xl hidden md:inline">|</span>
                                <span className="text-gray-500 font-medium">
                                    {job.company?.name || 'Company Name'}
                                </span>
                            </div>
                        </div>
                        <Button
                            mode="secondary"
                            size="sm"
                            iconLeft={<span className="material-icons-round text-sm">content_copy</span>}
                            className="shrink-0"
                            onClick={() => {
                                // Placeholder for clone action
                                console.log('Clone job clicked');
                            }}
                        >
                            Clone Job
                        </Button>
                    </div>

                    {/* Meta Info Row */}
                    <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <span className="material-icons-round text-orange-500 text-lg">place</span>
                            <span>{job.company?.country || job.location || 'Vietnam'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-icons-round text-orange-500 text-lg">payments</span>
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                {formatSalary(job.salaryStart, job.salaryEnd, job.currency)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-icons-round text-orange-500 text-lg">work_outline</span>
                            <span className="capitalize">{job.workingModel?.toLowerCase().replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-icons-round text-orange-500 text-lg">stars</span>
                            <span className="capitalize">{job.jobLevel?.toLowerCase()} Level</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-icons-round text-orange-500 text-lg">schedule</span>
                            <span>Posted {formatDate(job.uploadTime || job.createdAt)}</span>
                        </div>
                        {job.expDate && (
                            <div className="flex items-center gap-2">
                                <span className="material-icons-round text-red-500 text-lg">event_busy</span>
                                <span className="text-red-600 font-medium">Deadline: {formatDate(job.expDate)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobHeader;
