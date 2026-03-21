import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetJobDetailQuery } from '@/apis/apis';
import { useUpdateJobStatusMutation, useUpdateExpiredDateMutation } from '@/apis/jobApi';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import { Skeleton, Tabs, ConfigProvider, Modal, DatePicker, message, Select } from 'antd';
import dayjs from 'dayjs';
import JobHeader from './components/JobHeader';
import JobDescription from './components/JobDescription';
import JobApplicants from './components/JobApplicants';
import ProposedCVs from './components/ProposedCVs';
import { PageHeaderContext } from '@/contexts/PageHeaderContext';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setHeaderConfig } = useContext(PageHeaderContext);
    const [activeTab, setActiveTab] = useState('details');
    const { data: jobData, isLoading, error } = useGetJobDetailQuery(id);
    const job = jobData?.data;

    const [updateJobStatus, { isLoading: isClosingJob }] = useUpdateJobStatusMutation();
    const [updateExpiredDate, { isLoading: isUpdatingExpDate }] = useUpdateExpiredDateMutation();

    const [isExpDateModalVisible, setIsExpDateModalVisible] = useState(false);
    const [newExpDate, setNewExpDate] = useState(null);

    const handleCloseJob = () => {
        Modal.confirm({
            title: 'Close Job',
            content: 'Are you sure you want to close this job? This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await updateJobStatus({ id: job.id, status: 'CLOSED' }).unwrap();
                    message.success('Job closed successfully');
                } catch (err) {
                    message.error('Failed to close job');
                }
            }
        });
    };

    const handleCloneJob = () => {
        navigate('/jobs/create', { state: { clonedJobId: job.id } });
    };

    const handleUpdateExpDate = async () => {
        if (!newExpDate) {
            message.warning('Please select a new expiration date');
            return;
        }
        try {
            await updateExpiredDate({
                id: job.id,
                body: { expDate: newExpDate.toISOString() }
            }).unwrap();
            message.success('Expiration date updated successfully');
            setIsExpDateModalVisible(false);
        } catch (err) {
            message.error('Failed to update expiration date');
        }
    };

    if (isLoading) {
        return <Loading className="py-16" />;
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

    const formatSalary = (min, max) => {
        if (!min && !max) return 'Negotiable';
        const format = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
        if (min && !max) return `From ${format(min)}`;
        if (!min && max) return `Up to ${format(max)}`;
        return `${format(min)} - ${format(max)}`;
    };

    const tabItems = [
        {
            key: '1',
            label: 'Job Details',
            children: (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <JobHeader
                                job={job}
                                formatDate={formatDate}
                                formatSalary={formatSalary}
                                onCloseJob={handleCloseJob}
                                onCloneJob={handleCloneJob}
                                onEditExpDate={() => {
                                    setNewExpDate(job.expDate ? dayjs(job.expDate) : null);
                                    setIsExpDateModalVisible(true);
                                }}
                                isClosingJob={isClosingJob}
                            />
                            <div className="w-full h-px bg-gray-200 dark:bg-gray-700 my-6"></div>
                            <JobDescription job={job} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-lg bg-gray-900 text-white flex items-center justify-center text-xl font-bold">
                                    {job.company?.name ? job.company.name.slice(0, 1).toUpperCase() : 'C'}
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {job.company?.name || 'Company Details'}
                                </h3>
                            </div>
                            <div className="space-y-3 text-sm">
                                {job.company?.country && (
                                    <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                                        <span>Location</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{job.company.country}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                                    <span>Industry</span>
                                    <span className="font-medium text-gray-900 dark:text-white uppercase">Information Technology</span>
                                </div>
                            </div>
                        </div>

                        {/* Job Action Widget */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col gap-4">
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">Job Actions</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                                    Manage your job post visibility and details.
                                </p>
                            </div>

                            {/* Current Status */}
                            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-xl px-4 py-3">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Status</span>
                                <span className={`px-3 py-1 rounded-lg text-xs font-bold tracking-wide ${job.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600' :
                                    job.status === 'DRAFT' ? 'bg-neutral-100 text-neutral-500' :
                                        job.status === 'CLOSED' ? 'bg-red-50 text-red-500' :
                                            job.status === 'PENDING_REVIEW' ? 'bg-yellow-50 text-yellow-600' :
                                                job.status === 'SUSPENDED' ? 'bg-orange-50 text-orange-600' :
                                                    'bg-gray-100 text-gray-500'
                                    }`}>
                                    {job.status === 'PENDING_REVIEW' ? 'Pending Review' : job.status?.charAt(0) + job.status?.slice(1).toLowerCase()}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                {job.status === 'DRAFT' && (
                                    <>
                                        <Button
                                            mode="secondary"
                                            shape="round"
                                            loading={isClosingJob}
                                            iconLeft={<span className="material-icons-round text-sm">publish</span>}
                                            onClick={async () => {
                                                try {
                                                    await updateJobStatus({ id: job.id, status: 'PUBLISHED' }).unwrap();
                                                    message.success('Job published successfully');
                                                } catch {
                                                    message.error('Failed to publish job');
                                                }
                                            }}
                                        >
                                            Publish
                                        </Button>
                                        <Button
                                            mode="secondary"
                                            shape="round"
                                            loading={isClosingJob}
                                            iconLeft={<span className="material-icons-round text-sm">delete</span>}
                                            onClick={() => {
                                                Modal.confirm({
                                                    title: 'Delete Job',
                                                    content: 'Are you sure you want to delete this job?',
                                                    okText: 'Yes, Delete',
                                                    okButtonProps: { danger: true },
                                                    cancelText: 'Cancel',
                                                    onOk: async () => {
                                                        try {
                                                            await updateJobStatus({ id: job.id, status: 'ARCHIVED' }).unwrap();
                                                            message.success('Job deleted successfully');
                                                        } catch {
                                                            message.error('Failed to delete job');
                                                        }
                                                    }
                                                });
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </>
                                )}
                                {job.status === 'SUSPENDED' && (
                                    <Button
                                        mode="secondary"
                                        shape="round"
                                        className=""
                                        loading={isClosingJob}
                                        iconLeft={<span className="material-icons-round text-sm">delete</span>}
                                        onClick={() => {
                                            Modal.confirm({
                                                title: 'Delete Job',
                                                content: 'Are you sure you want to delete this job?',
                                                okText: 'Yes, Delete',
                                                okButtonProps: { danger: true },
                                                cancelText: 'Cancel',
                                                onOk: async () => {
                                                    try {
                                                        await updateJobStatus({ id: job.id, status: 'ARCHIVED' }).unwrap();
                                                        message.success('Job deleted successfully');
                                                    } catch {
                                                        message.error('Failed to delete job');
                                                    }
                                                }
                                            });
                                        }}
                                    >
                                        Delete
                                    </Button>
                                )}
                                {job.status === 'PUBLISHED' && (
                                    <Button
                                        mode="secondary"
                                        shape="round"
                                        className=""
                                        loading={isClosingJob}
                                        iconLeft={<span className="material-icons-round text-sm">cancel</span>}
                                        onClick={() => handleCloseJob()}
                                    >
                                        Close Job
                                    </Button>
                                )}
                                {job.status === 'CLOSED' && (
                                    <>
                                        <Button
                                            mode="secondary"
                                            shape="round"
                                            className=""
                                            loading={isClosingJob}
                                            iconLeft={<span className="material-icons-round text-sm">restart_alt</span>}
                                            onClick={async () => {
                                                try {
                                                    await updateJobStatus({ id: job.id, status: 'PUBLISHED' }).unwrap();
                                                    message.success('Job re-published successfully');
                                                } catch {
                                                    message.error('Failed to re-publish job');
                                                }
                                            }}
                                        >
                                            Re-post
                                        </Button>
                                        <Button
                                            mode="secondary"
                                            shape="round"
                                            className=""
                                            loading={isClosingJob}
                                            iconLeft={<span className="material-icons-round text-sm">archive</span>}
                                            onClick={() => {
                                                Modal.confirm({
                                                    title: 'Archive Job',
                                                    content: 'Are you sure you want to archive this job? It will be moved to the Archived section.',
                                                    okText: 'Yes, Archive',
                                                    cancelText: 'Cancel',
                                                    onOk: async () => {
                                                        try {
                                                            await updateJobStatus({ id: job.id, status: 'ARCHIVED' }).unwrap();
                                                            message.success('Job archived successfully');
                                                        } catch {
                                                            message.error('Failed to archive job');
                                                        }
                                                    }
                                                });
                                            }}
                                        >
                                            Archive
                                        </Button>
                                    </>
                                )}
                                {job.status === 'DRAFT' && (
                                    <Button
                                        mode="primary"
                                        shape="round"
                                        className=""
                                        onClick={() => navigate(`/jobs/${job.id}/edit`)}
                                        iconLeft={<span className="material-icons-round text-sm">edit</span>}
                                    >
                                        Edit
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: '2',
            label: 'Applicants',
            children: <JobApplicants jobId={job.id} />,
        },
        {
            key: '3',
            label: 'Proposed CVs',
            children: <ProposedCVs jobId={job.id} />,
        },
    ];

    return (
        <div className="space-y-4">
            {/* Back button */}
            <Button
                mode="text"
                className="text-gray-500 hover:text-primary pl-0 -ml-6"
                onClick={() => navigate('/jobs')}
                iconLeft={<span className="material-icons-round text-lg">arrow_back</span>}
            >
                Back to Jobs
            </Button>

            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#f97316',
                    },
                }}
            >
                <Tabs defaultActiveKey="1" items={tabItems} className="custom-tabs" />
            </ConfigProvider>

            <Modal
                title="Update Expired Date"
                open={isExpDateModalVisible}
                onOk={handleUpdateExpDate}
                onCancel={() => setIsExpDateModalVisible(false)}
                confirmLoading={isUpdatingExpDate}
            >
                <div className="py-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Expiration Date</label>
                    <DatePicker
                        className="w-full"
                        value={newExpDate}
                        onChange={(date) => setNewExpDate(date)}
                        disabledDate={(current) => current && current < dayjs().endOf('day')}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default JobDetail;
