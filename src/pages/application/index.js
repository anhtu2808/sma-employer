import React, { useState, useEffect } from 'react';
import { useGetApplicationsQuery, useUpdateApplicationStatusMutation } from '@/apis/applicationApi';
import { useGetMyJobsQuery } from '@/apis/jobApi';
import Button from '@/components/Button';
import Card from '@/components/Card';
import SearchInput from '@/components/SearchInput';
import { Drawer, Avatar, Space, Badge, Select, Spin } from 'antd';
import FilterSidebar from './filterSidebar';

const STATUS_COLUMNS = [
    { id: 'APPLIED', title: 'Applied', color: '#3B82F6', description: 'New applications' },
    { id: 'VIEWED', title: 'Viewed', color: '#6366F1', description: 'Opened by recruiter' },
    { id: 'SHORTLISTED', title: 'Shortlisted', color: '#A855F7', description: 'Potential candidates' },
    { id: 'NOT_SUITABLE', title: 'Not Suitable', color: '#EF4444', description: 'Rejected candidates' },
    { id: 'AUTO_REJECTED', title: 'Auto Rejected', color: '#9CA3AF', description: 'Below AI threshold' }
];

const ApplicationManagement = () => {
    // 1. Lấy danh sách Job của công ty
    const { data: jobsResponse, isLoading: isJobsLoading } = useGetMyJobsQuery({ page: 0, size: 100 });

    // 2. State quản lý Job được chọn và Filter
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [filter, setFilter] = useState({ page: 0, size: 50 });
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // 3. Tự động chọn Job đầu tiên khi danh sách tải xong lần đầu
    useEffect(() => {
        const jobs = jobsResponse?.data?.content;
        if (jobs && jobs.length > 0 && !selectedJobId) {
            setSelectedJobId(jobs[0].id);
        }
    }, [jobsResponse, selectedJobId]);

    // 4. RTK Query lấy danh sách ứng viên (chỉ gọi khi đã có selectedJobId)
    const { data: appData, isLoading: isAppLoading } = useGetApplicationsQuery(
        { ...filter, jobId: selectedJobId },
        { skip: !selectedJobId }
    );

    const [updateStatus] = useUpdateApplicationStatusMutation();

    // Nhóm dữ liệu theo cột Kanban
    const getCandidatesByStatus = (status) => {
        return appData?.data?.content?.filter(app => app.status === status) || [];
    };

    if (isJobsLoading) return <div className="h-full flex items-center justify-center"><Spin size="large" tip="Loading jobs..." /></div>;

    const jobs = jobsResponse?.data?.content || [];

    return (
        <div className="h-full flex flex-col space-y-6 animate-fadeIn">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-neutral-900 dark:text-white">CV Management</h1>
                    <p className="text-neutral-500 font-body">Track and manage candidate applications for your jobs</p>
                </div>

                {/* Dropdown chọn Job động */}
                <div className="w-full md:w-72">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase mb-1 block">Selected Job Position</span>
                    <Select
                        className="w-full custom-job-select"
                        placeholder="Select a job"
                        value={selectedJobId}
                        onChange={(value) => setSelectedJobId(value)}
                        options={jobs.map(job => ({
                            value: job.id,
                            label: (
                                <div className="flex justify-between items-center w-full">
                                    <span className="truncate">{job.name}</span>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ml-2 ${job.status === 'PUBLISHED' ? 'bg-green-100 text-green-600' : 'bg-neutral-100 text-neutral-500'
                                        }`}>
                                        {job.status}
                                    </span>
                                </div>
                            )
                        }))}
                    />
                </div>
            </div>

            {/* Toolbar */}
            <Card className="!p-4 bg-white dark:bg-surface-dark border-neutral-200">
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block">
                            <h2 className="text-lg font-bold dark:text-white font-heading">
                                {jobs.find(j => j.id === selectedJobId)?.name || "No Job Selected"}
                            </h2>
                            <p className="text-xs text-neutral-400">{appData?.data?.totalElements || 0} candidates found</p>
                        </div>
                    </div>

                    <div className="flex flex-1 max-w-md w-full">
                        <SearchInput
                            placeholder="Search by name, email, or skills..."
                            onChange={(e) => setFilter({ ...filter, keyword: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                            <Button mode="primary" size="sm">Kanban</Button>
                            <Button mode="ghost" size="sm">List</Button>
                        </div>
                        <Button
                            mode="secondary"
                            iconLeft={<span className="material-icons-round">filter_list</span>}
                            onClick={() => setIsFilterOpen(true)}
                        >
                            Filters
                        </Button>
                        <Button mode="secondary" iconLeft={<span className="material-icons-round">file_download</span>}>
                            Export
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Kanban Board Area */}
            <div className="flex-1 overflow-x-auto pb-4 scrollbar-thin relative">
                {isAppLoading && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-black/20 z-10 flex items-center justify-center backdrop-blur-sm">
                        <Spin />
                    </div>
                )}

                <div className="flex gap-6 h-full min-w-max">
                    {STATUS_COLUMNS.map(column => (
                        <div key={column.id} className="w-80 flex flex-col bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl p-4 border border-neutral-200 dark:border-neutral-800">
                            {/* Column Header */}
                            <div className="flex justify-between items-center mb-4 px-2">
                                <Space>
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: column.color }}></div>
                                    <span className="font-bold text-neutral-800 dark:text-white font-heading">{column.title}</span>
                                    <Badge count={getCandidatesByStatus(column.id).length} showZero color="#D1D5DB" className="text-neutral-500" />
                                </Space>
                            </div>

                            {/* Candidate Cards */}
                            <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                                {getCandidatesByStatus(column.id).map(app => (
                                    <Card
                                        key={app.applicationId}
                                        className="hover:shadow-lg transition-all border-l-4 group cursor-pointer"
                                        style={{ borderLeftColor: app.matchLevel === 'EXCELLENT' ? '#22C55E' : 'transparent' }}
                                    >
                                        <div className="flex gap-3">
                                            <Avatar size={40} className="bg-primary/10 text-primary font-bold">
                                                {app.candidateName.substring(0, 2).toUpperCase()}
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between">
                                                    <h4 className="font-bold text-sm truncate dark:text-white group-hover:text-primary transition-colors">
                                                        {app.candidateName}
                                                    </h4>
                                                    <span className="material-icons-round text-neutral-400 text-sm">more_vert</span>
                                                </div>
                                                <p className="text-xs text-neutral-500 truncate mb-1">{app.location || 'N/A'}</p>

                                                <div className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${app.aiScore >= 80 ? 'bg-green-50 text-green-600' :
                                                    app.aiScore >= 50 ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
                                                    }`}>
                                                    {app.aiScore || 0}% Match
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Slide-out Filter Sidebar */}
            <Drawer
                title={<span className="font-heading font-bold text-xl">Filter Candidates</span>}
                placement="right"
                onClose={() => setIsFilterOpen(false)}
                open={isFilterOpen}
                width={360}
            >
                <FilterSidebar onApply={(newFilters) => {
                    setFilter({ ...filter, ...newFilters });
                    setIsFilterOpen(false);
                }} />
            </Drawer>
        </div>
    );
};

export default ApplicationManagement;