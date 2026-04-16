import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Select } from 'antd';
import Button from '@/components/Button';
import { MOCK_JOBS } from '../mockData';

const TalentPoolHeader = ({
    poolCount,
    totalCandidates,
    searchTerm,
    setSearchTerm,
    onCreatePool,
    jobFilter,
    setJobFilter,
}) => {
    return (
        <div className="bg-white dark:bg-surface-dark shadow-sm border border-neutral-100 dark:border-neutral-800 rounded-2xl p-4">
            <div className="flex flex-col gap-4">
                {/* Top Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex flex-col">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white font-heading">
                            Talent Pools
                        </h2>
                        <p className="text-[13px] text-neutral-500 mt-0.5">
                            {poolCount} pool{poolCount !== 1 ? 's' : ''} · {totalCandidates} candidate{totalCandidates !== 1 ? 's' : ''} total
                        </p>
                    </div>

                    <Button
                        mode="primary"
                        shape="round"
                        iconLeft={<Plus size={16} />}
                        onClick={onCreatePool}
                    >
                        Create Pool
                    </Button>
                </div>

                {/* Search & Filter Row */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400/80" />
                        <input
                            type="text"
                            placeholder="Search candidates across all pools..."
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
                    <Select
                        allowClear
                        placeholder="Filter by job"
                        value={jobFilter}
                        onChange={(val) => setJobFilter(val || null)}
                        className="min-w-[200px]"
                        options={MOCK_JOBS.map((j) => ({ value: j.id, label: j.name }))}
                    />
                </div>
            </div>
        </div>
    );
};

export default TalentPoolHeader;
