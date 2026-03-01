import React, { useEffect, useState } from 'react';
import { Select, ConfigProvider } from 'antd';
import Input from '@/components/Input';
import { useGetJobsQuery } from '@/apis/apis';
import JobListItem from '@/components/JobListItem';
import Pagination from '@/components/Pagination';
import Button from '@/components/Button';
import { useNavigate } from 'react-router-dom';

const JobsList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [status, setStatus] = useState(null);
    const [workingModel, setWorkingModel] = useState(null);
    const [jobLevel, setJobLevel] = useState(null);
    const [location, setLocation] = useState(null);

    // Debounce search term
    // Debounce search term
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    // Reset page when filters change
    useEffect(() => {
        setPage(0);
    }, [searchTerm, status, workingModel, jobLevel, location, debouncedSearchTerm]);

    const { data: jobsData, isLoading: isJobsLoading } = useGetJobsQuery({
        name: debouncedSearchTerm || undefined,
        status,
        workingModel,
        jobLevel,
        location,
        page,
        size: pageSize
    });

    if (isJobsLoading) {
        return <div className="p-6">Loading...</div>;
    }

    const jobs = jobsData?.data?.content || [];
    const totalPages = jobsData?.data?.totalPages || 0;

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
            {/* Search and Filter Bar */}
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#f97316',
                        colorBorderHover: '#f97316',
                    },
                }}
            >
                <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-wrap md:flex-nowrap gap-3 items-center">
                    <Input
                        placeholder="Search by title or company..."
                        prefix={<span className="material-icons-round text-gray-400 text-xl">search</span>}

                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        allowClear
                    />
                    <Select
                        placeholder="All Status"
                        className="w-full md:w-32 h-10"
                        allowClear
                        onChange={setStatus}
                        suffixIcon={<span className="material-icons-round text-gray-400 text-lg">filter_list</span>}
                        options={[
                            { value: 'PUBLISHED', label: 'Published' },
                            { value: 'DRAFT', label: 'Draft' },
                            { value: 'PENDING_REVIEW', label: 'Pending' },
                            { value: 'SUSPENDED', label: 'Suspended' },
                            { value: 'CLOSED', label: 'Closed' },
                        ]}
                    />
                    <Select
                        placeholder="Working Model"
                        className="w-full md:w-40 h-10"
                        allowClear
                        onChange={setWorkingModel}
                        options={[
                            { value: 'ONSITE', label: 'Onsite' },
                            { value: 'REMOTE', label: 'Remote' },
                            { value: 'HYBRID', label: 'Hybrid' },
                        ]}
                    />
                    <Select
                        placeholder="Job Level"
                        className="w-full md:w-32 h-10"
                        allowClear
                        onChange={setJobLevel}
                        options={[
                            { value: 'INTERN', label: 'Intern' },
                            { value: 'FRESHER', label: 'Fresher' },
                            { value: 'JUNIOR', label: 'Junior' },
                            { value: 'MIDDLE', label: 'Middle' },
                            { value: 'SENIOR', label: 'Senior' },
                            { value: 'MANAGER', label: 'Manager' },
                            { value: 'DIRECTOR', label: 'Director' },
                        ]}
                    />
                    <Select
                        placeholder="All Locations"
                        className="w-full md:w-36 h-10"
                        allowClear
                        onChange={setLocation}
                        suffixIcon={<span className="material-icons-round text-gray-400 text-lg">place</span>}
                        options={[
                            { value: 'Hanoi', label: 'Hanoi' },
                            { value: 'Ho Chi Minh City', label: 'Ho Chi Minh' },
                            { value: 'Da Nang', label: 'Da Nang' },
                            { value: 'Remote', label: 'Remote' },
                        ]}
                    />
                    <Button
                        mode="primary"
                        onClick={() => navigate('/jobs/create')}
                        iconLeft={<span className="material-icons-round">add</span>}
                        className="shrink-0 ml-auto"
                    >
                        Post a Job
                    </Button>
                </div>
            </ConfigProvider>

            {jobs.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-icons-round text-gray-400 text-3xl">work_outline</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
                    <p className="text-gray-500 mt-1 mb-6">Try adjusting your search or filters.</p>
                    <Button
                        mode="primary"
                        onClick={() => navigate('/jobs/create')}
                    >
                        Post a Job
                    </Button>
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-4">
                        {jobs.map((job) => (
                            <JobListItem
                                key={job.id}
                                id={job.id}
                                title={job.name}
                                status={job.status || 'Active'}
                                postedTime={formatDate(job.uploadTime || job.createdAt)}
                                location={job.company?.country || job?.locations?.map(l => l.city).join(', ') || job.workingModel}
                                salary={formatSalary(job.salaryStart, job.salaryEnd, job.currency)}
                                expiry={job.expDate ? `Ends on ${new Date(job.expDate).toLocaleDateString()}` : ''}
                                tags={[
                                    job.jobLevel,
                                    job.workingModel,
                                    ...(job.skills || []).map(s => s.name)
                                ].filter(Boolean)}
                                stats={{
                                    applicants: job.applicantsCount,
                                    views: job.viewsCount,
                                }}
                                onViewDetails={() => navigate(`/jobs/${job.id}`)}
                            />
                        ))}
                    </div>

                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </>
            )}
        </div>
    );
};
export default JobsList;
