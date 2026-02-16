import React, { useState, useEffect, Fragment } from 'react';
import { useGetApplicationsQuery, useUpdateApplicationStatusMutation } from '@/apis/applicationApi';
import { useGetJobsQuery } from '@/apis/jobApi';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown, Check, Briefcase, X, Filter, Plus, LayoutGrid, List as ListIcon } from 'lucide-react';
import Button from '@/components/Button';
import { Drawer, Avatar, Space, Badge, Spin } from 'antd';
import FilterSidebar from './filterSidebar';
import { Search } from 'lucide-react';
import ApplicationList from './list';
import KanbanBoard from './kanban';
import { message } from 'antd';

const STATUS_COLUMNS = [
    { id: 'APPLIED', title: 'Applied', color: '#FF6B35' },
    { id: 'VIEWED', title: 'Viewed', color: '#6366F1' },
    { id: 'SHORTLISTED', title: 'Shortlisted', color: '#10B981' },
    { id: 'NOT_SUITABLE', title: 'Not Suitable', color: '#EF4444' },
    { id: 'AUTO_REJECTED', title: 'Auto Rejected', color: '#9CA3AF' }
];


const ApplicationManagement = () => {
    const { data: jobsResponse, isLoading: isJobsLoading } = useGetJobsQuery({ page: 0, size: 100 });
    const [selectedJob, setSelectedJob] = useState(null);
    const [updateStatus] = useUpdateApplicationStatusMutation();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState({ page: 0, size: 50 });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [viewMode, setViewMode] = useState('kanban');
    const [page, setPage] = useState(0);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectData, setRejectData] = useState({ id: null, status: null });
    const [rejectReason, setRejectReason] = useState('');

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
    useEffect(() => {
        setFilter(prev => ({ ...prev, page: page }));
    }, [page]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setFilter(prev => ({
                ...prev,
                keyword: searchTerm || undefined
            }));
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const STATUS_AVATAR_STYLES = {
        APPLIED: "bg-orange-100 text-orange-600",
        VIEWED: "bg-indigo-100 text-indigo-600",
        SHORTLISTED: "bg-emerald-100 text-emerald-600",
        NOT_SUITABLE: "bg-red-100 text-red-600",
        AUTO_REJECTED: "bg-gray-100 text-gray-600"
    };


    const getCandidatesByStatus = (status) => {
        return appData?.data?.content?.filter(app => app.status === status) || [];
    };

    if (isJobsLoading) return <div className="h-full flex items-center justify-center"><Spin size="large" tip="Loading jobs..." /></div>;

    const jobs = jobsResponse?.data?.content || [];

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return;
        }

        const applicationId = draggableId;
        const newStatus = destination.droppableId;
        if (newStatus === 'NOT_SUITABLE') {
            setRejectData({ id: applicationId, status: newStatus });
            setIsRejectModalOpen(true);
            return;
        }
        handleUpdateStatus(applicationId, newStatus);
    };

    const handleUpdateStatus = async (id, status, reason = null) => {
        try {
            await updateStatus({
                id: id,
                status: status,
                rejectReason: reason
            }).unwrap();

            message.success(`Application moved to ${status} successfully`);

            // Reset states
            setIsRejectModalOpen(false);
            setRejectReason('');
            setRejectData({ id: null, status: null });
        } catch (error) {
            const errorMessage = error?.data?.message || "An unexpected error occurred while updating status";
            message.error(errorMessage);
            if (error?.data?.code === 400 || error?.data?.status === "BAD_REQUEST") {
                setIsRejectModalOpen(false);
            }

            console.error("Update Status Error:", error);
        }
    };

    return (
        <div className="h-full flex flex-col space-y-3 animate-fadeIn font-body">
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

            <div className="bg-white dark:bg-surface-dark border border-neutral-100 dark:border-neutral-800 rounded-t-[24px] rounded-b-none p-4">
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
                                placeholder="Search candidates by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-neutral-50 dark:bg-gray-900 border border-neutral-100 dark:border-neutral-700 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-neutral-400/60 dark:text-white shadow-sm"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                                >
                                    <Plus size={16} className="rotate-45" />
                                </button>
                            )}
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
            <div className="flex-1 min-h-0 relative">
                {isAppLoading && (
                    <div className="absolute inset-0 bg-white/40 dark:bg-black/20 z-50 flex items-center justify-center backdrop-blur-sm rounded-[24px]">
                        <Spin size="large" />
                    </div>
                )}

                {viewMode === 'kanban' ? (
                    <KanbanBoard
                        statusColumns={STATUS_COLUMNS}
                        getCandidatesByStatus={getCandidatesByStatus}
                        onDragEnd={onDragEnd}
                        statusAvatarStyles={STATUS_AVATAR_STYLES}
                    />
                ) : (
                    <ApplicationList
                        data={appData?.data?.content || []}
                        isLoading={isAppLoading}
                        totalElements={appData?.data?.totalElements || 0}
                        totalPages={appData?.data?.totalPages || 0}
                        currentPage={page}
                        onPageChange={(newPage) => setPage(newPage)}
                        onStatusUpdate={handleUpdateStatus}
                    />
                )}
            </div>

            {isRejectModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/70 backdrop-blur-lg p-2 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-surface-dark rounded-[48px] w-full max-w-lg p-6 shadow-2xl relative border border-white/10 animate-in zoom-in duration-300 text-center">

                        <button
                            onClick={() => {
                                setIsRejectModalOpen(false);
                                setRejectReason('');
                            }}
                            className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-all"
                        >
                            <Plus size={22} className="rotate-45" strokeWidth={3} />
                        </button>

                        <div className="mb-5 mt-4">
                            <h3 className="text-2xl font-black text-neutral-900 dark:text-white font-heading uppercase tracking-tighter">
                                Reject Candidate
                            </h3>
                            <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-[0.2em] mt-2 italic px-4 leading-relaxed">
                                Are you sure to move this application to <span className="text-red-500">Not Suitable</span> status? Please state the reason.
                            </p>
                        </div>

                        <div className="space-y-3 text-left">
                            <div className="space-y-3">
                                <label className="flex justify-between items-center px-2">
                                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">
                                        Reason for rejection
                                    </span>
                                    <span className="text-[9px] font-bold text-neutral-300 uppercase tracking-widest italic">
                                        (Optional)
                                    </span>
                                </label>
                                <textarea
                                    rows={4}
                                    autoFocus
                                    placeholder="Provide a reason or leave it blank to continue..."
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    className="w-full p-6 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700 rounded-[32px] text-sm font-bold text-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring-4 focus:ring-red-500/5 transition-all resize-none shadow-inner font-body"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between mt-6">
                            <Button
                                mode="secondary"
                                className="!rounded-2xl !h-14 font-black uppercase tracking-widest text-[10px] !text-neutral-400 border-none hover:!bg-neutral-50"
                                onClick={() => {
                                    setIsRejectModalOpen(false);
                                    setRejectReason('');
                                }}
                            >
                                Discard
                            </Button>
                            <Button
                                mode="primary"
                                className="border-none text-neutral-400"
                                onClick={() => handleUpdateStatus(rejectData.id, rejectData.status, rejectReason)}
                            >
                                Confirm & Reject
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar Filter */}
            <Drawer
                title={<span className="font-heading font-black text-lg uppercase tracking-tight">Filter Candidates</span>}
                placement="right"
                onClose={() => setIsFilterOpen(false)}
                open={isFilterOpen}
                width={380}
                className="custom-drawer"
            >
                <FilterSidebar
                    currentFilters={filter}
                    onApply={(newFilters) => {
                        setFilter(prev => ({
                            ...prev,
                            ...newFilters,
                            page: 0
                        }));
                        setIsFilterOpen(false);
                    }}
                    onReset={(resetState) => setFilter({ ...resetState, jobId: selectedJob?.id, page: 0, size: viewMode === 'kanban' ? 1000 : 10 })}
                />
            </Drawer>
        </div>
    );
};

export default ApplicationManagement;