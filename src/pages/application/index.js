import React, { useState, useEffect, Fragment } from 'react';
import { useGetApplicationsQuery, useUpdateApplicationStatusMutation, useLazyGetShortlistedExportQuery, useLazyDownloadResumesZipQuery, useLazyGetApplicationDetailQuery } from '@/apis/applicationApi';
import { useGetJobsQuery, useUpdateJobStatusMutation } from '@/apis/jobApi';
import { useGetTalentPoolsQuery, useAddTalentPoolItemMutation, useCreateTalentPoolMutation, useMoveTalentPoolItemMutation } from '@/apis/talentPoolApi';

import { Drawer, Modal as AntModal } from 'antd';
import FilterSidebar from './filterSidebar';
import ApplicationList from './list';
import KanbanBoard from './kanban';
import toastMessage from '@/utils/toastMessage';
import { usePageHeader } from '@/hooks/usePageHeader';
import Modal from '@/components/Modal';
import Loading from '@/components/Loading';
import ApplicationHeader from './header';
import { exportCandidates } from './export';
import { Checkbox } from 'antd';
import { useSearchParams } from 'react-router-dom';
import RecruiteeConfigModal from './recruitee';
import { useGetRecruiteeConfigQuery } from '@/apis/recruiteeApi';
import CreatePoolModal from '../talent-pool/create-pool-modal';
import { Plus } from 'lucide-react';

const STATUS_COLUMNS = [
    { id: 'APPLIED', title: 'Applied', color: '#01afffff' },
    { id: 'VIEWED', title: 'Viewed', color: '#6366F1' },
    { id: 'SHORTLISTED', title: 'Shortlisted', color: '#FF6B35' },
    { id: 'REJECTED', title: 'Rejected', color: '#EF4444' },
    { id: 'APPROVED', title: 'Approved', color: '#10B981' }
];


const ApplicationManagement = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { data: jobsResponse, isLoading: isJobsLoading } = useGetJobsQuery({ page: 0, size: 100 });
    const [selectedJob, setSelectedJob] = useState(null);
    const [updateStatus] = useUpdateApplicationStatusMutation();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState({ page: 0, size: 50 });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortBy, setSortBy] = useState('AI_SCORE');
    const viewMode = searchParams.get('tab') === 'list' ? 'list' : 'kanban';
    const statusFilter = searchParams.get('status') || '';
    const setViewMode = (mode) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            next.set('tab', mode);
            return next;
        });
    };
    const handleStatusFilterChange = (key) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            if (key) {
                next.set('status', key);
            } else {
                next.delete('status');
            }
            return next;
        });
        setPage(0);
    };
    const [page, setPage] = useState(0);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectData, setRejectData] = useState({ id: null, status: null });
    const [rejectReason, setRejectReason] = useState('');
    const [triggerExport, { isFetching: isExporting }] = useLazyGetShortlistedExportQuery();
    const [updateJobStatus] = useUpdateJobStatusMutation();
    const [showToCandidate, setShowToCandidate] = useState(false);
    const [triggerDownloadZip, { isFetching: isDownloadingZip }] = useLazyDownloadResumesZipQuery();
    const [isRecruiteeModalOpen, setIsRecruiteeModalOpen] = useState(false);
    const { data: recruiteeConfig } = useGetRecruiteeConfigQuery();

    // Talent Pool
    const { data: poolsResponse } = useGetTalentPoolsQuery();
    const pools = poolsResponse?.data || [];
    const [addTalentPoolItem, { isLoading: isAddingToPool }] = useAddTalentPoolItemMutation();
    const [moveTalentPoolItem, { isLoading: isMovingPool }] = useMoveTalentPoolItemMutation();
    const [createTalentPool, { isLoading: isCreatingPool }] = useCreateTalentPoolMutation();
    const [triggerGetDetail, { isFetching: isFetchingDetail }] = useLazyGetApplicationDetailQuery();
    const [isPoolModalOpen, setIsPoolModalOpen] = useState(false);
    const [isCreatePoolOpen, setIsCreatePoolOpen] = useState(false);
    const [poolTargetAppId, setPoolTargetAppId] = useState(null);
    const [currentPoolInfo, setCurrentPoolInfo] = useState(null);
    const isPoolBusy = isAddingToPool || isMovingPool;

    usePageHeader('Application Management', 'Track and manage candidate applications for your jobs');

    useEffect(() => {
        const jobs = jobsResponse?.data?.content;
        if (jobs && jobs.length > 0 && !selectedJob) {
            const savedJobId = sessionStorage.getItem('sma_employer_selected_job_id');
            if (savedJobId) {
                const savedJob = jobs.find(j => j.id === Number(savedJobId) || j.id === savedJobId);
                if (savedJob) {
                    setSelectedJob(savedJob);
                    return;
                }
            }
            setSelectedJob(jobs[0]);
        }
    }, [jobsResponse, selectedJob]);

    const handleSetSelectedJob = (job) => {
        setSelectedJob(job);
        if (job) {
            sessionStorage.setItem('sma_employer_selected_job_id', job.id);
        } else {
            sessionStorage.removeItem('sma_employer_selected_job_id');
        }
    };

    const showAiSort = selectedJob?.enableAiScoring === true;

    const activeFiltersCount = (
        (filter.locationId ? 1 : 0) +
        (filter.matchLevel ? 1 : 0) +
        (filter.language ? 1 : 0) +
        (filter.appliedFrom || filter.appliedTo ? 1 : 0) +
        (filter.skills?.length ? 1 : 0)
    );

    const handleMinScoreChange = (val) => {
        setFilter(prev => ({
            ...prev,
            minScore: val > 0 ? val : undefined,
            page: 0,
        }));
    };

    const [pollInterval, setPollInterval] = useState(0);

    const { data: appData, isLoading: isAppLoading } = useGetApplicationsQuery(
        { ...filter, jobId: selectedJob?.id, sortBy: showAiSort ? sortBy : undefined },
        { 
            skip: !selectedJob?.id,
            pollingInterval: pollInterval
        }
    );

    useEffect(() => {
        const hasPending = appData?.data?.content?.some(app => 
            app.evaluation?.status === 'WAITING' || app.evaluation?.status === 'PARTIAL'
        );
        setPollInterval(hasPending ? 5000 : 0);
    }, [appData]);

    useEffect(() => {
        setFilter(prev => ({ ...prev, page: page }));
    }, [page]);

    useEffect(() => {
        setFilter(prev => ({
            ...prev,
            status: statusFilter || undefined,
            page: 0,
        }));
    }, [statusFilter]);

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

    if (isJobsLoading) return <Loading className="py-16" />;

    const jobs = jobsResponse?.data?.content || [];


    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return;
        }

        const applicationId = draggableId;
        const newStatus = destination.droppableId;
        if (newStatus === 'REJECTED') {
            setRejectData({ id: applicationId, status: newStatus });
            setIsRejectModalOpen(true);
            return;
        }
        handleUpdateStatus(applicationId, newStatus);
    };

    const handleUpdateStatus = async (id, status, reason = null, showReason = false) => {
        try {
            await updateStatus({
                id: id,
                status: status,
                rejectReason: reason,
                showToCandidate: showReason
            }).unwrap();

            toastMessage.success(`Application moved to ${status} successfully`);

            // Reset states
            setIsRejectModalOpen(false);
            setRejectReason('');
            setRejectData({ id: null, status: null });
            setShowToCandidate(false);
        } catch (error) {
            const errorMessage = error?.data?.message || "An unexpected error occurred while updating status";
            toastMessage.error(errorMessage);
            if (error?.data?.code === 400 || error?.data?.status === "BAD_REQUEST") {
                setIsRejectModalOpen(false);
            }

            console.error("Update Status Error:", error);
        }
    };

    const handleExportExcel = async (type = 'XLSX') => {
        if (!selectedJob) return toastMessage.warning("Please select a job first");

        try {
            const result = await triggerExport({
                jobId: selectedJob.id,
                type: type
            }).unwrap();

            if (result?.data && result.data.length > 0) {
                exportCandidates(result.data, selectedJob.name, type);
                toastMessage.success(`Exported ${result.data.length} candidates successfully`);
            } else {
                toastMessage.warning("No approved candidates found to export");
            }
        } catch (error) {
            console.error("Export error:", error);
            toastMessage.error(error?.data?.message || "Failed to export candidates");
        }
    };

    const handleDownloadZip = async () => {
        if (!selectedJob) return toastMessage.warning("Please select a job first");

        try {
            toastMessage.info("Preparing ZIP file, please wait...");
            const blob = await triggerDownloadZip(selectedJob.id).unwrap();

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Resumes_${selectedJob.name.replace(/\s+/g, '_')}.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toastMessage.success("Download started!");
        } catch (error) {
            console.error("ZIP Error:", error);
            toastMessage.error("Failed to download resumes");
        }
    };

    return (
        <div className="h-full flex flex-col space-y-3 animate-fadeIn font-body">

            <ApplicationHeader
                jobs={jobs}
                selectedJob={selectedJob}
                setSelectedJob={handleSetSelectedJob}
                appData={appData}
                viewMode={viewMode}
                setViewMode={setViewMode}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setIsFilterOpen={setIsFilterOpen}
                isExporting={isExporting}
                onExport={handleExportExcel}
                onDownloadZip={handleDownloadZip}
                isDownloadingZip={isDownloadingZip}
                statusFilter={statusFilter}
                recruiteeConfig={recruiteeConfig?.data}
                onConnectRecruitee={() => setIsRecruiteeModalOpen(true)}
                onStatusFilterChange={handleStatusFilterChange}
                sortBy={sortBy}
                onSortChange={setSortBy}
                showAiSort={showAiSort}
                minScore={filter.minScore ?? 0}
                onMinScoreChange={handleMinScoreChange}
                activeFiltersCount={activeFiltersCount}
                onArchiveJob={(job) => {
                    AntModal.confirm({
                        title: 'Archive Job',
                        content: 'Are you sure you want to archive this job? It will be moved to the Archived section.',
                        okText: 'Yes, Archive',
                        okButtonProps: { danger: true },
                        cancelText: 'Cancel',
                        centered: true,
                        onOk: async () => {
                            try {
                                // Find the previous job before archiving
                                const availableJobs = jobs.filter(j =>
                                    (j.status === 'CLOSED' || j.status === 'PUBLISHED') && j.id !== job.id
                                );
                                const currentIndex = jobs
                                    .filter(j => j.status === 'CLOSED' || j.status === 'PUBLISHED')
                                    .findIndex(j => j.id === job.id);
                                const previousJob = availableJobs[Math.max(0, currentIndex - 1)] || availableJobs[0] || null;

                                await updateJobStatus({ id: job.id, status: 'ARCHIVED' }).unwrap();
                                toastMessage.success('Job archived successfully');

                                // Auto-select previous job if the archived job was selected
                                if (selectedJob?.id === job.id) {
                                    handleSetSelectedJob(previousJob);
                                }
                            } catch {
                                toastMessage.error('Failed to archive job');
                            }
                        }
                    });
                }}
            />


            {/* Kanban Board */}
            <div className="flex-1 min-h-0 relative">
                {isAppLoading && (
                    <div className="absolute inset-0 bg-white/40 dark:bg-black/20 z-50 flex items-center justify-center backdrop-blur-sm rounded-[24px]">
                        <Loading size={92} inline />
                    </div>
                )}

                {viewMode === 'kanban' ? (
                    <KanbanBoard
                        statusColumns={STATUS_COLUMNS}
                        getCandidatesByStatus={getCandidatesByStatus}
                        onDragEnd={onDragEnd}
                        onDropToPool={async (applicationId) => {
                            setPoolTargetAppId(applicationId);
                            setCurrentPoolInfo(null);
                            setIsPoolModalOpen(true);
                            try {
                                const result = await triggerGetDetail(applicationId).unwrap();
                                const poolInfo = result?.data?.applicationInfo?.poolInfo || null;
                                setCurrentPoolInfo(poolInfo);
                            } catch (e) {
                                console.error('Failed to fetch application detail for pool info', e);
                            }
                        }}
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
            <RecruiteeConfigModal
                open={isRecruiteeModalOpen}
                onClose={() => setIsRecruiteeModalOpen(false)}
                jobs={jobsResponse?.data?.content || []}
            />
            <Modal
                open={isRejectModalOpen}
                title="Reject Candidate"
                onCancel={() => {
                    setIsRejectModalOpen(false);
                    setRejectReason('');
                }}
                onSubmit={() => handleUpdateStatus(rejectData.id, rejectData.status, rejectReason, showToCandidate)}
                submitText="Confirm & Reject"
                danger
                width={500}
            >
                <div className="text-left space-y-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Are you sure to move this application to <span className="text-red-500 font-medium">Rejected</span> status? Please state the reason.
                    </p>

                    <div className="space-y-3">
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
                        <div className="flex items-center gap-2 px-1">
                            <Checkbox
                                id="showReason"
                                checked={showToCandidate}
                                onChange={(e) => setShowToCandidate(e.target.checked)}
                            />
                            <label htmlFor="showReason" className="text-sm text-neutral-600 dark:text-neutral-400 cursor-pointer select-none">
                                Allow candidate to see this rejection reason
                            </label>
                        </div>
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
                    onClose={() => setIsFilterOpen(false)}
                    onApply={(newFilters) => {
                        setFilter(prev => ({
                            ...prev,
                            ...newFilters,
                            page: 0
                        }));
                        setIsFilterOpen(false);
                    }}
                />
            </Drawer>

            {/* Add to Talent Pool Modal */}
            <Modal
                open={isPoolModalOpen}
                title="Add to Talent Pool"
                onCancel={() => { setIsPoolModalOpen(false); setPoolTargetAppId(null); setCurrentPoolInfo(null); }}
                submitText="null"
                footer={null}
                width={400}
            >
                {isFetchingDetail ? (
                    <div className="flex items-center justify-center py-10">
                        <Loading size={48} inline />
                    </div>
                ) : (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-3.5 pb-2 p-1">
                        {pools.length === 0 ? (
                            <div className="text-center py-6 bg-neutral-50 dark:bg-neutral-800 rounded-xl space-y-3">
                                <p className="text-gray-500 text-sm">No talent pools found.</p>
                            </div>
                        ) : (
                            pools.map(pool => {
                                const isCurrent = currentPoolInfo?.id != null && String(pool.id) === String(currentPoolInfo.id);
                                return (
                                    <button
                                        key={pool.id}
                                        onClick={async () => {
                                            if (!poolTargetAppId) return;
                                            try {
                                                if (currentPoolInfo?.poolItemId && currentPoolInfo?.id && String(currentPoolInfo.id) !== String(pool.id)) {
                                                    await moveTalentPoolItem({ id: currentPoolInfo.poolItemId, groupId: pool.id }).unwrap();
                                                    toastMessage.success('Candidate moved to new talent pool!');
                                                } else {
                                                    await addTalentPoolItem({ applicationId: Number(poolTargetAppId), groupId: pool.id }).unwrap();
                                                    toastMessage.success('Candidate added to talent pool!');
                                                }
                                                setIsPoolModalOpen(false);
                                                setPoolTargetAppId(null);
                                                setCurrentPoolInfo(null);
                                            } catch (err) {
                                                toastMessage.error(err?.data?.message || 'Failed to update talent pool');
                                            }
                                        }}
                                        disabled={isPoolBusy || isCurrent}
                                        className={`w-full text-left px-4 py-3 bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-100 dark:border-neutral-700 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:border-orange-200 dark:hover:border-orange-500/30 transition-all flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed ${isCurrent ? 'ring-2 ring-inset ring-orange-500/50' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-3.5 h-3.5 rounded-full ring-2 ring-white dark:ring-neutral-900 shadow-sm" style={{ backgroundColor: pool.color || '#ccc' }}></div>
                                            <span className="font-medium text-sm text-neutral-800 dark:text-neutral-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                                {pool.name}
                                                {isCurrent && <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-orange-500">(Current)</span>}
                                            </span>
                                        </div>
                                        {isCurrent && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                                    </button>
                                );
                            })
                        )}

                        <button
                            onClick={() => setIsCreatePoolOpen(true)}
                            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-neutral-900 border border-dashed border-gray-300 dark:border-gray-600 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-gray-500 hover:text-orange-600 rounded-xl transition-all"
                        >
                            <Plus size={16} />
                            <span className="text-sm font-medium">Create new pool</span>
                        </button>
                    </div>
                )}
            </Modal>

            {/* Create Pool Modal */}
            <CreatePoolModal
                open={isCreatePoolOpen}
                onCancel={() => setIsCreatePoolOpen(false)}
                onCreate={async (name, color) => {
                    try {
                        await createTalentPool({ name, color }).unwrap();
                        toastMessage.success('Talent pool created successfully');
                        setIsCreatePoolOpen(false);
                    } catch (err) {
                        toastMessage.error(err?.data?.message || 'Failed to create talent pool');
                    }
                }}
                isCreating={isCreatingPool}
            />
        </div>
    );
};

export default ApplicationManagement;
