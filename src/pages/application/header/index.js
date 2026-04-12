import React from 'react';
import { Select, Tabs, ConfigProvider } from 'antd';
import { Search, Filter, Plus, LayoutGrid, List as ListIcon, Download, Archive, FileArchive } from 'lucide-react';
import Button from '@/components/Button';
import { getJobStatusConfig } from '@/constrant/application';
import { Dropdown } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines, faTableCells } from '../../../utils/icons';
import IntegrationMenu from '../integration';

const APPLICATION_STATUS_TABS = [
    { key: '', label: 'All' },
    { key: 'APPLIED', label: 'Applied' },
    { key: 'VIEWED', label: 'Viewed' },
    { key: 'SHORTLISTED', label: 'Shortlisted' },
    { key: 'REJECTED', label: 'Rejected' },
    { key: 'APPROVED', label: 'Approved' },
];

const ApplicationHeader = ({
    jobs,
    selectedJob,
    setSelectedJob,
    appData,
    viewMode,
    setViewMode,
    searchTerm,
    setSearchTerm,
    setIsFilterOpen,
    isExporting,
    onExport,
    onArchiveJob,
    statusFilter,
    onStatusFilterChange,
    onDownloadZip,
    isDownloadingZip,
    sortBy,
    onSortChange,
    showAiSort,
    recruiteeConfig,
    onConnectRecruitee,
}) => {

    const exportMenuItems = [
        {
            key: 'XLSX',
            label: 'Export as Excel (.xlsx)',
            icon: <FontAwesomeIcon icon={faTableCells} className="text-sm" />,
            onClick: () => onExport('XLSX')
        },
        {
            key: 'CSV',
            label: 'Export as CSV (.csv)',
            icon: <FontAwesomeIcon icon={faFileLines} className="text-sm" />,
            onClick: () => onExport('CSV')
        }, {
            type: 'divider',
        },
        {
            key: 'ZIP',
            label: 'Download all CVs (.zip)',
            icon: <FileArchive size={16} className="text-orange-500" />,
            disabled: isDownloadingZip,
            onClick: onDownloadZip
        }
    ];
    const getExportButtonLabel = () => {
        if (isExporting) return 'Exporting...';
        if (isDownloadingZip) return 'Zipping...';
        return 'Export';
    };
    return (
        <div className="bg-white dark:bg-surface-dark shadow-sm border border-neutral-100 dark:border-neutral-800 rounded-2xl p-4">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex flex-col">
                        <Select
                            className="job-title-select w-full min-w-[320px] h-[40px] -ml-2"
                            value={selectedJob?.id}
                            onChange={(value) => {
                                const job = jobs.find(j => j.id === value);
                                setSelectedJob(job);
                            }}
                            placeholder="Select a Job"
                            showSearch
                            suffixIcon={<Search size={16} className="text-neutral-400" />}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={jobs
                                .filter(job => job.status === 'CLOSED' || job.status === 'PUBLISHED')
                                .map((job) => ({
                                    value: job.id,
                                    label: job.name,
                                    job: job
                                }))}
                            labelRender={(props) => {
                                if (!props.value) return <span>Select a Job</span>;

                                const job = jobs.find(j => j.id === props.value);
                                if (!job) return <span>{props.label}</span>;

                                const statusConfig = getJobStatusConfig(job.status);
                                return (
                                    <div className="flex items-center gap-3 w-full h-full pb-1 mt-[2px]">
                                        <span className="truncate text-base font-medium text-neutral-900 dark:text-neutral-100">
                                            {job.name}
                                        </span>
                                        <span className={`text-[12px] font-normal translate-y-[1px] ${statusConfig.color}`}>
                                            {statusConfig.label}
                                        </span>
                                    </div>
                                );
                            }}
                            optionRender={(option) => {
                                const job = option.data.job;
                                const statusConfig = getJobStatusConfig(job.status);
                                return (
                                    <div className="flex items-center justify-between py-1">
                                        <div className="flex flex-col min-w-0 flex-1">
                                            <span className="truncate text-[14px] font-medium text-neutral-900 dark:text-neutral-100">
                                                {job.name}
                                            </span>
                                            <span className={`text-[11px] font-normal mt-0.5 ${statusConfig.color}`}>
                                                {statusConfig.label}
                                            </span>
                                        </div>
                                        {job.status === 'CLOSED' && onArchiveJob && (
                                            <button
                                                className="p-1.5 rounded-lg hover:bg-orange-50 text-gray-400 hover:text-orange-500 transition-all shrink-0 ml-2"
                                                title="Archive Job"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onArchiveJob(job);
                                                }}
                                            >
                                                <Archive size={15} />
                                            </button>
                                        )}
                                    </div>
                                );
                            }}
                            dropdownStyle={{ borderRadius: '12px', padding: '8px' }}
                        />
                        <p className="text-[13px] text-neutral-500 mt-1 pl-1">
                            {appData?.data?.totalElements || 0} applications found
                        </p>
                    </div>

                    <div className="flex p-1 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl gap-2 self-start sm:self-auto shrink-0">
                        <Button
                            mode={viewMode === 'kanban' ? 'primary' : 'ghost'}
                            size="md"
                            shape="round"
                            onClick={() => setViewMode('kanban')}
                        >
                            <div className="flex items-center gap-1 whitespace-nowrap">
                                <LayoutGrid size={16} />
                                <span className="text-xs font-semibold">
                                    Kanban
                                </span>
                            </div>
                        </Button>

                        <Button
                            mode={viewMode === 'list' ? 'primary' : 'ghost'}
                            size="md"
                            shape="round"
                            onClick={() => setViewMode('list')}
                        >
                            <div className="flex items-center gap-1 whitespace-nowrap">
                                <ListIcon size={16} />
                                <span className="text-xs font-semibold">
                                    List
                                </span>
                            </div>
                        </Button>

                    </div>
                </div>

                <div className="flex flex-col lg:flex-row justify-between items-center gap-3 w-full">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400/80" />
                        <input
                            type="text"
                            placeholder="Search candidates by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-2 bg-neutral-50 dark:bg-gray-900 border border-neutral-100 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-neutral-400/60 dark:text-white shadow-sm"
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

                    <div className="flex items-center gap-3 w-full lg:w-auto shrink-0">
                        {showAiSort && (
                            <Select
                                value={sortBy}
                                onChange={onSortChange}
                                className="min-w-[160px]"
                                options={[
                                    { value: 'AI_SCORE', label: 'By Score' },
                                    { value: 'DATE', label: 'By Date' },
                                ]}
                            />
                        )}

                        <Button
                            mode="secondary"
                            className=""
                            shape="round"
                            iconLeft={<Filter size={16} />}
                            onClick={() => setIsFilterOpen(true)}
                        >
                            Filters
                        </Button>
                        <Dropdown menu={{ items: exportMenuItems }} trigger={['click']} disabled={isExporting || isDownloadingZip}>
                            <Button
                                mode="secondary"
                                shape="round"
                                loading={isExporting || isDownloadingZip}
                                iconLeft={<Download size={16} />}
                            >
                                {getExportButtonLabel()}
                            </Button>
                        </Dropdown>
                        <IntegrationMenu
                            config={recruiteeConfig}
                            onConnectRecruitee={onConnectRecruitee}
                        />
                    </div>
                </div>

                {viewMode === 'list' && (
                    <ConfigProvider
                        theme={{
                            token: {
                                colorPrimary: '#f97316',
                                colorBorderHover: '#f97316',
                            },
                            components: {
                                Tabs: {
                                    inkBarColor: '#f97316',
                                    itemSelectedColor: '#f97316',
                                    itemHoverColor: '#f97316',
                                },
                            },
                        }}
                    >
                        <Tabs
                            activeKey={statusFilter}
                            onChange={onStatusFilterChange}
                            items={APPLICATION_STATUS_TABS.map(tab => ({
                                key: tab.key,
                                label: tab.label,
                            }))}
                            className="application-status-tabs -mb-3"
                        />
                    </ConfigProvider>
                )}
            </div>
        </div>
    );
};

export default ApplicationHeader;
