import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetJobDetailQuery } from '@/apis/apis';
import Button from '@/components/Button';
import { Skeleton } from 'antd';
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

    return (
        <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
            <Button
                mode="text"
                className="self-start text-gray-500 hover:text-primary pl-0"
                onClick={() => navigate('/jobs')}
            >
                <span className="material-icons-round text-lg mr-1">arrow_back</span>
                Back to Jobs
            </Button>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
                <JobHeader job={job} formatDate={formatDate} formatSalary={formatSalary} />
                <JobDescription job={job} />
            </div>
        </div>
    );
};

export default JobDetail;
