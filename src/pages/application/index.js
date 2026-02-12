import React, { useState, useEffect, Fragment } from 'react';
import { useGetApplicationsQuery, useUpdateApplicationStatusMutation } from '@/apis/applicationApi';
import { useGetMyJobsQuery } from '@/apis/jobApi';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown, Check, Briefcase, Download, Filter, Plus, LayoutGrid, List as ListIcon } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { Drawer, Avatar, Space, Badge, Spin } from 'antd';
import FilterSidebar from './filterSidebar';
import { Search } from 'lucide-react';

const STATUS_COLUMNS = [
    { id: 'APPLIED', title: 'Applied', color: '#3B82F6' },
    { id: 'VIEWED', title: 'Viewed', color: '#6366F1' },
    { id: 'SHORTLISTED', title: 'Shortlisted', color: '#A855F7' },
    { id: 'NOT_SUITABLE', title: 'Not Suitable', color: '#EF4444' },
    { id: 'AUTO_REJECTED', title: 'Auto Rejected', color: '#9CA3AF' }
];

const ApplicationManagement = () => {
    const { data: jobsResponse, isLoading: isJobsLoading } = useGetMyJobsQuery({ page: 0, size: 100 });
    const [selectedJob, setSelectedJob] = useState(null);
    const [filter, setFilter] = useState({ page: 0, size: 50 });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [viewMode, setViewMode] = useState('kanban');

    useEffect(() => {
        const jobs = jobsResponse?.data?.content;
        if (jobs && jobs.length > 0 && !selectedJob) {
            setSelectedJob(jobs[0]);
        }
    }, [jobsResponse, selectedJob]);

    const { data: appData, isLoading: isAppLoading } = useGetApplicationsQuery(
        { ...filter, jobId: selectedJob?.id },
        { skip: !selectedJob?.id }
    );

    const [updateStatus] = useUpdateApplicationStatusMutation();

    const getCandidatesByStatus = (status) => {
        return appData?.data?.content?.filter(app => app.status === status) || [];
    };

    if (isJobsLoading) return <div className="h-full flex items-center justify-center"><Spin size="large" tip="Loading jobs..." /></div>;

    const jobs = jobsResponse?.data?.content || [];

    return (
        <div className="h-full flex flex-col space-y-6 animate-fadeIn font-body">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-2">
                <div>
                    <h1 className="text-xl font-extrabold font-heading text-neutral-900 dark:text-white uppercase tracking-tight">CV Management</h1>
                    <p className="text-[11px] text-neutral-400 font-medium mt-1 tracking-widest uppercase italic">Track and manage candidate applications for your jobs</p>
                </div>

                {/* --- CUSTOM DROPDOWN (LIKE SKILL MANAGEMENT) --- */}
                <div className="relative w-full md:w-80 mt-4 md:mt-0">
                    <Listbox value={selectedJob} onChange={setSelectedJob}>
                        <div className="relative">
                            <Listbox.Button className="relative w-full cursor-default rounded-2xl bg-white dark:bg-gray-800 border border-neutral-100 dark:border-neutral-700 py-3 pl-12 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                                <span className="block truncate text-[11px] font-black uppercase tracking-widest text-neutral-700 dark:text-neutral-200">
                                    {selectedJob ? selectedJob.name : 'Select a Job'}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                    <ChevronDown className="h-4 w-4 text-neutral-400" aria-hidden="true" />
                                </span>
                            </Listbox.Button>

                            <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-white dark:bg-gray-800 py-2 text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-neutral-100 dark:border-neutral-700 animate-in fade-in zoom-in duration-200">
                                    {jobs.map((job) => (
                                        <Listbox.Option
                                            key={job.id}
                                            value={job}
                                            className={({ active }) => `relative cursor-pointer select-none py-3 pl-12 pr-4 transition-colors ${active ? 'bg-primary/5 text-primary' : 'text-neutral-700 dark:text-neutral-300'}`}
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <div className="flex flex-col">
                                                        <span className={`block truncate text-[12px] ${selected ? 'font-black text-primary' : 'font-bold'}`}>
                                                            {job.name}
                                                        </span>
                                                        <span className={`text-[8px] ${job.status === 'PUBLISHED' ? 'text-green-500' : 'text-neutral-400'}`}>
                                                            {job.status}
                                                        </span>
                                                    </div>
                                                    {selected ? (
                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-primary">
                                                            <Check size={16} strokeWidth={3} />
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>
                </div>
            </div>

            <div className="bg-white dark:bg-surface-dark border-neutral-100 shadow-sm rounded-[24px] p-4">
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="hidden md:block">
                                <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white tracking-tight font-heading">
                                    {selectedJob?.name || "No Job Selected"}
                                </h3>
                                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">
                                    {appData?.data?.totalElements || 0} candidates found
                                </p>
                            </div>
                        </div>

                        <div className="flex p-1  rounded-xl gap-2">
                            <Button
                                mode={viewMode === 'kanban' ? 'primary' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('kanban')}
                            >
                                <div className="flex items-center gap-1 whitespace-nowrap">
                                    <LayoutGrid size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-wider">
                                        Kanban
                                    </span>
                                </div>
                            </Button>

                            <Button
                                mode={viewMode === 'list' ? 'primary' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('list')}
                            >
                                <div className="flex items-center gap-1 whitespace-nowrap">
                                    <ListIcon size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-wider">
                                        List
                                    </span>
                                </div>
                            </Button>

                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row justify-between items-center ">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400/80" />
                            <input
                                type="text"
                                placeholder="Search candidates by name, email, or skills..."
                                onChange={(e) => setFilter({ ...filter, keyword: e.target.value })}
                                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl text-xs font-bold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/10 placeholder:text-neutral-400/60"
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full lg:w-auto">
                            <Button
                                mode="secondary"
                                className=" lg:flex-none !rounded-xl border-neutral-100 !h-11 !pl-6 !text-[11px] font-black uppercase tracking-widest  flex items-center gap-2"
                                iconLeft={<Filter size={16} />}
                                onClick={() => setIsFilterOpen(true)}
                            >
                                Filters
                            </Button>
                            {/* <Button
                                mode="secondary"
                                className="flex-1 lg:flex-none  uppercase tracking-widest  flex items-center gap-2"
                                iconLeft={<Download size={16} />}
                            >
                                Export
                            </Button> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar relative">
                {isAppLoading && (
                    <div className="absolute inset-0 bg-white/40 dark:bg-black/10 z-10 flex items-center justify-center backdrop-blur-[2px] rounded-3xl">
                        <Spin size="large" />
                    </div>
                )}

                <div className="flex gap-6 h-full min-w-max px-2">
                    {STATUS_COLUMNS.map(column => (
                        <div key={column.id} className="w-80 flex flex-col bg-neutral-50/50 dark:bg-neutral-900/30 rounded-[32px] p-5 border border-neutral-100 dark:border-neutral-800">
                            <div className="flex justify-between items-center mb-6 px-2">
                                <Space>
                                    <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: column.color }}></div>
                                    <span className="text-[11px] font-black text-neutral-700 dark:text-white uppercase tracking-widest">{column.title}</span>
                                    <Badge count={getCandidatesByStatus(column.id).length} showZero color="#fb923c" className="text-[10px] font-black" />
                                </Space>
                            </div>

                            <div className="flex-1 space-y-4 overflow-y-auto pr-1 custom-scrollbar">
                                {getCandidatesByStatus(column.id).map(app => (
                                    <Card
                                        key={app.applicationId}
                                        className="!p-4 hover:shadow-xl transition-all border border-neutral-100 dark:border-neutral-800 rounded-2xl group cursor-pointer relative overflow-hidden"
                                    >
                                        <div className={`absolute top-0 left-0 w-1 h-full ${app.matchLevel === 'EXCELLENT' ? 'bg-green-500' : 'bg-transparent'}`} />
                                        <div className="flex gap-4">
                                            <Avatar size={44} className="bg-orange-100 text-orange-600 font-black text-xs rounded-xl shadow-sm">
                                                {app.candidateName.substring(0, 2).toUpperCase()}
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold text-[13px] truncate dark:text-white group-hover:text-primary transition-colors tracking-tight">
                                                        {app.candidateName}
                                                    </h4>
                                                </div>
                                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter mt-0.5">{app.location || 'N/A'}</p>

                                                <div className={`mt-3 inline-flex items-center px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter ${app.aiScore >= 80 ? 'bg-green-50 text-green-600' :
                                                    app.aiScore >= 50 ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
                                                    }`}>
                                                    {app.aiScore || 0}% AI Match
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

            {/* Sidebar Filter */}
            <Drawer
                title={<span className="font-heading font-black text-lg uppercase tracking-tight">Filter Candidates</span>}
                placement="right"
                onClose={() => setIsFilterOpen(false)}
                open={isFilterOpen}
                width={380}
                className="custom-drawer"
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