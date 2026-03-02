import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetJobDetailQuery } from '@/apis/apis';
import { useUpdateJobStatusMutation, useUpdateExpiredDateMutation } from '@/apis/jobApi';
import Button from '@/components/Button';
import { Skeleton, Tabs, ConfigProvider, Modal, DatePicker, message, Select } from 'antd';
import dayjs from 'dayjs';
import JobHeader from './components/JobHeader';
import JobDescription from './components/JobDescription';
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
                            <div className="flex flex-row items-end gap-2">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
                                    <Select
                                        value={job.status}
                                        onChange={async (value) => {
                                            try {
                                                await updateJobStatus({ id: job.id, status: value }).unwrap();
                                                message.success('Job status updated successfully');
                                            } catch {
                                                message.error('Failed to update job status');
                                            }
                                        }}
                                        loading={isClosingJob}
                                        className="w-full h-10 select-status"
                                        options={[
                                            { value: 'PUBLISHED', label: 'Published' },
                                            { value: 'DRAFT', label: 'Draft' },
                                            { value: 'PENDING_REVIEW', label: 'Pending Review' },
                                            { value: 'SUSPENDED', label: 'Suspended' },
                                            { value: 'CLOSED', label: 'Closed' },
                                        ]}
                                    />
                                </div>
                                <Button
                                    mode="primary"
                                    className="h-10 px-6 shrink-0"
                                    onClick={() => navigate(`/jobs/${job.id}/edit`)}
                                    iconLeft={<span className="material-icons-round text-sm">edit</span>}
                                >
                                    Edit Job
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: '2',
            label: 'Applicants',
            children: <div className="p-4 text-center text-gray-500">No applicants yet.</div>,
        },
        {
            key: '3',
            label: 'Proposed CVs',
            children: <div className="p-4 text-center text-gray-500">No proposed CVs.</div>,
        },
    ];

    return (
        <div className="w-full max-w-[95%] mx-auto space-y-4 pb-12">
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
