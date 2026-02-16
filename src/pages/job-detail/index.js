import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetJobDetailQuery } from '@/apis/apis';
import Button from '@/components/Button';
import { Skeleton, Tabs, ConfigProvider } from 'antd';
import JobHeader from './components/JobHeader';
import JobDescription from './components/JobDescription';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: jobData, isLoading, error } = useGetJobDetailQuery(id);
    const job = jobData?.data;

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
        const format = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency }).format(num);
        if (min && !max) return `From ${format(min)}`;
        if (!min && max) return `Up to ${format(max)}`;
        return `${format(min)} - ${format(max)}`;
    };

    const tabItems = [
        {
            key: '1',
            label: 'Job Details',
            children: (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-8">
                    <JobHeader job={job} formatDate={formatDate} formatSalary={formatSalary} />
                    <JobDescription job={job} />
                </div>
            ),
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
        <div className="p-4 md:p-6 w-full max-w-[95%] mx-auto space-y-4">
            {/* Tabs Navigation */}
            <Button
                mode="text"
                className="self-start text-gray-500 hover:text-primary pl-0 -ml-20"
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
        </div>
    );
};

export default JobDetail;
