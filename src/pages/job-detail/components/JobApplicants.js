import React, { useState, useEffect } from 'react';
import { useGetApplicationsQuery, useUpdateApplicationStatusMutation } from '@/apis/applicationApi';
import { useGetJobDetailQuery } from '@/apis/apis';
import FilterSidebar from '@/pages/application/filterSidebar';
import ApplicationList from '@/pages/application/list';
import Button from '@/components/Button';
import { Drawer, Select, Badge, Popover, Slider } from 'antd';
import toastMessage from '@/utils/toastMessage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket } from '../../../utils/icons';
import { Search, Filter, Plus, Zap, Users } from 'lucide-react';

const JobApplicants = ({ jobId }) => {
    const { data: jobData } = useGetJobDetailQuery(jobId, { skip: !jobId });
    const jobStatus = jobData?.data?.status;
    const isUnpublished = jobStatus === 'DRAFT' || jobStatus === 'PENDING_REVIEW';

    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState({ page: 0, size: 10 });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortBy, setSortBy] = useState('AI_SCORE');
    const [page, setPage] = useState(0);

    const [updateStatus] = useUpdateApplicationStatusMutation();

    const showAiSort = jobData?.data?.enableAiScoring === true;

    const { data: appData, isLoading } = useGetApplicationsQuery(
        { ...filter, jobId, sortBy: showAiSort ? sortBy : undefined },
        { skip: !jobId }
    );

    const applications = appData?.data?.content || [];
    const totalElements = appData?.data?.totalElements || 0;
    const totalPages = appData?.data?.totalPages || 0;

    useEffect(() => {
        setFilter(prev => ({ ...prev, page }));
    }, [page]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setFilter(prev => ({
                ...prev,
                keyword: searchTerm || undefined,
                page: 0
            }));
            setPage(0);
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleUpdateStatus = async (id, status, reason = null) => {
        try {
            await updateStatus({ id, status, rejectReason: reason }).unwrap();
            toastMessage.success(`Application moved to ${status} successfully`);
        } catch (error) {
            const errorMessage = error?.data?.message || 'An unexpected error occurred while updating status';
            toastMessage.error(errorMessage);
        }
    };

    const activeFilterCount = [
        filter.locationId,
        filter.matchLevel,
        filter.candidateLevels?.length > 0,
        filter.minScore,
        filter.language,
        filter.appliedFrom || filter.appliedTo,
        filter.skills?.length > 0,
    ].filter(Boolean).length;

    const handleMinScoreChange = (val) => {
        setFilter(prev => ({
            ...prev,
            minScore: val > 0 ? val : undefined,
            page: 0,
        }));
    };

    const [draftMinScore, setDraftMinScore] = useState(filter.minScore ?? 0);
    useEffect(() => { setDraftMinScore(filter.minScore ?? 0); }, [filter.minScore]);

    if (isUnpublished) {
        return (
            <PublishFirstPlaceholder
                description="Applicants will appear here once your job is published and candidates start applying."
            />
        );
    }

    return (
        <div className="flex flex-col gap-4 animate-fadeIn">
            {/* Header bar: search + filter */}
            <div className="bg-white dark:bg-surface-dark shadow-sm border border-neutral-100 dark:border-neutral-800 rounded-2xl p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <Users size={16} className="text-primary" />
                        <span className="font-semibold text-neutral-800 dark:text-white">{totalElements}</span> applicants found
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400/80" />
                            <input
                                type="text"
                                placeholder="Search candidates..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-9 pl-10 pr-4 bg-neutral-50 dark:bg-gray-900 border border-neutral-100 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-neutral-400/60 dark:text-white shadow-sm w-64"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                                >
                                    <Plus size={16} className="rotate-45" />
                                </button>
                            )}
                        </div>
                        {showAiSort && (
                            <Select
                                value={sortBy}
                                onChange={setSortBy}
                                className="min-w-[160px] h-9"
                                options={[
                                    { value: 'AI_SCORE', label: 'By Score' },
                                    { value: 'DATE', label: 'By Date' },
                                ]}
                            />
                        )}
                        {showAiSort && (
                            <Popover
                                trigger="click"
                                placement="bottomRight"
                                content={(
                                    <div className="w-64 px-1 py-2">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">
                                                Minimum AI Score
                                            </span>
                                            {draftMinScore > 0 && (
                                                <button
                                                    type="button"
                                                    className="text-xs font-medium text-primary hover:underline"
                                                    onClick={() => { setDraftMinScore(0); handleMinScoreChange(0); }}
                                                >
                                                    Clear
                                                </button>
                                            )}
                                        </div>
                                        <Slider
                                            min={0}
                                            max={100}
                                            value={draftMinScore}
                                            onChange={setDraftMinScore}
                                            onChangeComplete={handleMinScoreChange}
                                            tooltip={{ formatter: (v) => `${v}%` }}
                                            trackStyle={{ backgroundColor: '#FF6B35' }}
                                            handleStyle={{ borderColor: '#FF6B35' }}
                                        />
                                        <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
                                            <span>0%</span>
                                            <span className="font-semibold text-orange-500">{draftMinScore}%</span>
                                            <span>100%</span>
                                        </div>
                                    </div>
                                )}
                            >
                                <Button
                                    mode="secondary"
                                    shape="round"
                                    size="sm"
                                    iconLeft={<Zap size={16} className={filter.minScore > 0 ? 'text-orange-500' : ''} />}
                                >
                                    Min Score{filter.minScore > 0 ? `: ${filter.minScore}%` : ''}
                                </Button>
                            </Popover>
                        )}
                        <Badge count={activeFilterCount} color="#ef4444" size="small" offset={[-4, 4]}>
                            <button
                                type="button"
                                aria-label="Filters"
                                onClick={() => setIsFilterOpen(true)}
                                className="h-9 w-9 flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-200 hover:border-primary hover:text-primary transition-colors bg-white dark:bg-surface-dark"
                            >
                                <Filter size={16} />
                            </button>
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Reuse polished ApplicationList */}
            <ApplicationList
                data={applications}
                isLoading={isLoading}
                totalElements={totalElements}
                totalPages={totalPages}
                currentPage={page}
                onPageChange={setPage}
                onStatusUpdate={handleUpdateStatus}
            />

            {/* Filter Drawer */}
            <Drawer
                title={<span className="font-heading font-bold text-lg">Filter Applicants</span>}
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
                        setPage(0);
                        setIsFilterOpen(false);
                    }}
                    onReset={(resetState) => setFilter({ ...resetState, jobId, page: 0, size: 10 })}
                />
            </Drawer>
        </div>
    );
};

const PublishFirstPlaceholder = ({ description }) => (
    <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fadeIn">
        <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center">
            <FontAwesomeIcon icon={faRocket} className="text-4xl text-amber-400" />
        </div>
        <h3 className="text-lg font-bold text-neutral-800 dark:text-white">Publish your job first</h3>
        <p className="text-sm text-neutral-400 text-center max-w-sm">{description}</p>
    </div>
);

export default JobApplicants;
