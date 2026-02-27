import React from 'react';
import { Tag, Dropdown, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import JobSkills from './JobSkills';
import Button from '@/components/Button';
import { useUpdateJobStatusMutation } from '@/apis/jobApi';

const JobHeader = ({ job, formatDate, formatSalary }) => {
    const navigate = useNavigate();
    const [updateJobStatus] = useUpdateJobStatusMutation();

    const handleStatusChange = async (newStatus) => {
        try {
            await updateJobStatus({ id: job.id, status: newStatus }).unwrap();
            message.success(`Job status updated to ${newStatus}`);
        } catch (error) {
            console.error('Failed to update job status:', error);
            message.error('Failed to update job status');
        }
    };

    const statusItems = [
        { label: 'Published', key: 'PUBLISHED' },
        { label: 'Draft', key: 'DRAFT' },
        { label: 'Pending Review', key: 'PENDING_REVIEW' },
        { label: 'Suspended', key: 'SUSPENDED' },
        { label: 'Closed', key: 'CLOSED' },
    ];

    const menuProps = {
        items: statusItems,
        onClick: ({ key }) => handleStatusChange(key),
    };
    return (
        <div className="space-y-6">
            {/* Job Title */}
            <div className="flex justify-between items-start gap-4">
                <div>
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {job.name}
                        </h1>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${job.status === 'PUBLISHED' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400' :
                            job.status === 'PENDING_REVIEW' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                job.status === 'SUSPENDED' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400' :
                                    'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400'
                            }`}>
                            {job.status?.replace('_', ' ')}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                            {job.company?.name || 'Company Name'}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span>Posted {formatDate(job.uploadTime || job.createdAt)}</span>
                    </div>
                </div>
                <Button
                    mode="secondary"
                    size="sm"
                    className="shrink-0"
                    iconLeft={<span className="material-icons-round text-sm">content_copy</span>}
                >
                    Clone Job
                </Button>
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

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                    mode="primary"
                    size="sm"
                    iconLeft={<span className="material-icons-round text-sm">edit</span>}
                    onClick={() => navigate(`/jobs/${job.id}/edit`)}
                >
                    Update Job
                </Button>
                <Dropdown menu={menuProps} trigger={['click']} placement="bottomRight">
                    <Button
                        mode="secondary"
                        size="sm"
                        iconLeft={<span className="material-icons-round text-sm">swap_horiz</span>}
                    >
                        Change Status
                    </Button>
                </Dropdown>
            </div>
        </div>
    );
};

export default JobHeader;
