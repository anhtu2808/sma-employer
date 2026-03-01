import React, { useState, useEffect, Fragment } from 'react';
import { useGetApplicationsQuery, useUpdateApplicationStatusMutation } from '@/apis/applicationApi';
import { useGetJobsQuery } from '@/apis/jobApi';

import { Drawer, Spin } from 'antd';
import FilterSidebar from './filterSidebar';
import ApplicationList from './list';
import KanbanBoard from './kanban';
import { message } from 'antd';
import { usePageHeader } from '@/hooks/usePageHeader';
import Modal from '@/components/Modal';
import ApplicationHeader from './header';

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

    usePageHeader('Application Management', 'Track and manage candidate applications for your jobs');

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

            <ApplicationHeader 
                jobs={jobs}
                selectedJob={selectedJob}
                setSelectedJob={setSelectedJob}
                appData={appData}
                viewMode={viewMode}
                setViewMode={setViewMode}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setIsFilterOpen={setIsFilterOpen}
            />


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

            <Modal
                open={isRejectModalOpen}
                title="Reject Candidate"
                onCancel={() => {
                    setIsRejectModalOpen(false);
                    setRejectReason('');
                }}
                onSubmit={() => handleUpdateStatus(rejectData.id, rejectData.status, rejectReason)}
                submitText="Confirm & Reject"
                danger
                width={500}
            >
                <div className="text-left space-y-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Are you sure to move this application to <span className="text-red-500 font-medium">Not Suitable</span> status? Please state the reason.
                    </p>

                    <div className="space-y-2">
                        <label className="flex justify-between items-center px-1">
                            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                Reason for rejection
                            </span>
                            <span className="text-xs text-neutral-400">
                                (Optional)
                            </span>
                        </label>
                        <textarea
                            rows={4}
                            autoFocus
                            placeholder="Provide a reason or leave it blank to continue..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="w-full p-4 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm text-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 transition-all resize-none font-body"
                        />
                    </div>
                </div>
            </Modal>

            {/* Sidebar Filter */}
            <Drawer
                title={<span className="font-heading font-bold text-lg">Filter Applications</span>}
                placement="right"
                onClose={() => setIsFilterOpen(false)}
                open={isFilterOpen}
                width={500}
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