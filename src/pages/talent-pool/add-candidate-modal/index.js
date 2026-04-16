import React, { useState, useMemo } from 'react';
import { Search, Check } from 'lucide-react';
import { Select } from 'antd';
import Modal from '@/components/Modal';
import { MOCK_CANDIDATES, MOCK_JOBS } from '../mockData';

const AddCandidateModal = ({ open, onCancel, onSubmit, existingIds = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [jobFilter, setJobFilter] = useState(null);

    const filteredCandidates = useMemo(() => {
        return MOCK_CANDIDATES.filter((c) => {
            // Exclude already-in-pool candidates
            if (existingIds.includes(c.applicationId)) return false;

            // Job filter
            if (jobFilter && c.jobId !== jobFilter) return false;

            // Search
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                return (
                    c.candidateName.toLowerCase().includes(term) ||
                    c.candidateEmail.toLowerCase().includes(term) ||
                    (c.jobTitle && c.jobTitle.toLowerCase().includes(term))
                );
            }
            return true;
        });
    }, [searchTerm, existingIds, jobFilter]);

    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleSubmit = () => {
        onSubmit(selectedIds);
        setSearchTerm('');
        setSelectedIds([]);
        setJobFilter(null);
    };

    const handleCancel = () => {
        setSearchTerm('');
        setSelectedIds([]);
        setJobFilter(null);
        onCancel();
    };

    const getScoreColor = (score) => {
        if (!score && score !== 0) return 'text-gray-400';
        if (score >= 80) return 'text-emerald-600';
        if (score >= 50) return 'text-orange-500';
        return 'text-red-500';
    };

    return (
        <Modal
            open={open}
            title="Add Candidates to Pool"
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            submitText={`Add ${selectedIds.length > 0 ? `(${selectedIds.length})` : ''}`}
            submitDisabled={selectedIds.length === 0}
            width={600}
        >
            <div className="space-y-4">
                {/* Search & Filter Row */}
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400/80" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-gray-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-neutral-400/60 dark:text-white"
                        />
                    </div>
                    <Select
                        allowClear
                        placeholder="Filter by job"
                        value={jobFilter}
                        onChange={(val) => setJobFilter(val || null)}
                        className="min-w-[160px]"
                        options={MOCK_JOBS.map((j) => ({ value: j.id, label: j.name }))}
                    />
                </div>

                {/* Candidate List */}
                <div className="max-h-[340px] overflow-y-auto custom-scrollbar space-y-1.5 pr-1">
                    {filteredCandidates.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-sm text-gray-400">No candidates found</p>
                            <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">
                                Try adjusting your search or filter
                            </p>
                        </div>
                    ) : (
                        filteredCandidates.map((c) => {
                            const isSelected = selectedIds.includes(c.applicationId);
                            return (
                                <button
                                    key={c.applicationId}
                                    onClick={() => toggleSelect(c.applicationId)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left
                                        ${isSelected
                                            ? 'border-primary/50 bg-orange-50/50 dark:bg-primary/10 ring-1 ring-primary/20'
                                            : 'border-neutral-100 dark:border-neutral-700 hover:border-neutral-200 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                                        }
                                    `}
                                >
                                    {/* Checkbox */}
                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all
                                        ${isSelected
                                            ? 'border-primary bg-primary'
                                            : 'border-gray-300 dark:border-gray-600'
                                        }
                                    `}>
                                        {isSelected && <Check size={12} className="text-white" />}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                {c.candidateName}
                                            </span>
                                            {c.evaluation?.aiScore != null && (
                                                <span className={`text-xs font-bold ${getScoreColor(c.evaluation.aiScore)}`}>
                                                    {Math.round(c.evaluation.aiScore)}%
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {c.candidateEmail}
                                            </span>
                                            {c.jobTitle && (
                                                <>
                                                    <span className="text-gray-300 dark:text-gray-600">·</span>
                                                    <span className="text-xs text-blue-500 font-medium truncate">
                                                        {c.jobTitle}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>

                {/* Selection summary */}
                {selectedIds.length > 0 && (
                    <div className="flex items-center justify-between px-1 pt-2 border-t border-neutral-100 dark:border-neutral-700">
                        <span className="text-xs text-gray-500">
                            {selectedIds.length} candidate{selectedIds.length > 1 ? 's' : ''} selected
                        </span>
                        <button
                            onClick={() => setSelectedIds([])}
                            className="text-xs text-primary hover:underline font-medium"
                        >
                            Clear all
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default AddCandidateModal;
