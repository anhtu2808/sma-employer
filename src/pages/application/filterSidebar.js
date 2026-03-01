import React, { useState } from 'react';
import { Slider, Select, Tag } from 'antd';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { Info, MapPin, Briefcase, DollarSign, Brain, Zap, X } from 'lucide-react';

const FilterSidebar = ({ onApply, onReset, currentFilters }) => {
    const [filters, setFilters] = useState({
        status: currentFilters?.status || undefined,
        location: currentFilters?.location || undefined,
        matchLevel: currentFilters?.matchLevel || undefined,
        minScore: currentFilters?.minScore || undefined,
        skills: currentFilters?.skills || []
    });

    const [skillInput, setSkillInput] = useState('');
    const handleAddSkill = () => {
        const trimmed = skillInput.trim();
        if (trimmed && !filters.skills.includes(trimmed)) {
            setFilters({ ...filters, skills: [...filters.skills, trimmed] });
            setSkillInput('');
        }
    };

    const handleRemoveSkill = (removedSkill) => {
        setFilters({
            ...filters,
            skills: filters.skills.filter(s => s !== removedSkill)
        });
    };

    const handleReset = () => {
        const resetState = {
            status: undefined,
            location: undefined,
            matchLevel: undefined,
            minScore: undefined,
            skills: []
        };
        setFilters(resetState);
        onApply(resetState);
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-surface-dark font-body">
            <div className="flex-1 overflow-y-auto space-y-8 pb-6 custom-scrollbar">
                <p className="text-sm text-gray-500 leading-relaxed">
                    Refine your candidate list using advanced parameters.
                </p>

                {/* Status Filter */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-neutral-900 dark:text-white font-semibold text-sm">
                        <Info size={14} className="text-primary" /> Application Status
                    </label>
                    <Select
                        className="w-full custom-select-filter"
                        placeholder="All Statuses"
                        value={filters.status}
                        allowClear
                        onChange={(val) => setFilters({ ...filters, status: val })}
                        options={[
                            { value: 'APPLIED', label: 'Applied' },
                            { value: 'VIEWED', label: 'Viewed' },
                            { value: 'SHORTLISTED', label: 'Shortlisted' },
                            { value: 'NOT_SUITABLE', label: 'Not Suitable' },
                            { value: 'AUTO_REJECTED', label: 'Auto Rejected' },
                        ]}
                    />
                </div>

                {/* Location Filter */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-neutral-900 dark:text-white font-semibold text-sm">
                        <MapPin size={14} className="text-primary" /> Location
                    </label>
                    <Input
                        placeholder="e.g. Ho Chi Minh, Ha Noi..."
                        value={filters.location}
                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                        className="!rounded-xl"
                    />
                </div>

                {/* AI Match Level Filter */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-neutral-900 dark:text-white font-semibold text-sm">
                        <Brain size={14} className="text-primary" /> AI Match Level
                    </label>
                    <Select
                        className="w-full"
                        placeholder="Any Level"
                        value={filters.matchLevel}
                        allowClear
                        onChange={(val) => setFilters({ ...filters, matchLevel: val })}
                        options={[
                            { value: 'EXCELLENT', label: 'Excellent' },
                            { value: 'GOOD', label: 'Good' },
                            { value: 'FAIR', label: 'Fair' },
                            { value: 'POOR', label: 'Poor' },
                            { value: 'NOT_MATCHED', label: 'Not Matched' },
                        ]}
                    />
                </div>

                {/* Minimum Match Score Slider */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-neutral-900 dark:text-white font-semibold text-sm">
                        <Zap size={14} className="text-orange-500" /> Min AI Score: {filters.minScore}%
                    </label>
                    <Slider
                        value={filters.minScore}
                        onChange={(val) => setFilters({ ...filters, minScore: val })}
                        trackStyle={{ backgroundColor: '#FF6B35' }}
                        handleStyle={{ borderColor: '#FF6B35' }}
                    />
                </div>

                {/* Required Skills (List<String>) */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-neutral-900 dark:text-white font-semibold text-sm">
                        <Briefcase size={14} className="text-primary" /> Required Skills
                    </label>
                    <div className="flex gap-2">
                        <input
                            placeholder="Add skill..."
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                            className="flex-1 px-4 py-2 bg-neutral-50 dark:bg-gray-800 border border-neutral-100 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                        <Button
                            shape="round"
                            mode="primary"
                            size="sm"
                            onClick={handleAddSkill}>
                            Add
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {filters.skills.map(skill => (
                            <Tag
                                key={skill}
                                closable
                                onClose={() => handleRemoveSkill(skill)}
                                className="bg-orange-50 border-orange-100 text-orange-600 font-medium rounded-lg px-2 py-1 flex items-center gap-1"
                                closeIcon={<X size={10} />}
                            >
                                {skill.toUpperCase()}
                            </Tag>
                        ))}
                    </div>
                </div>
            </div>

            {/* Actions Footer */}
            <div className="flex justify-between items-center border-t border-neutral-100 dark:border-neutral-800 pt-4">
                <Button
                    shape="round"
                    mode="secondary"
                    onClick={handleReset}
                >
                    Reset
                </Button>

                <Button
                    shape="round"
                    mode="primary"
                    onClick={() => onApply(filters)}>
                    Apply Filter
                </Button>
            </div>
        </div>
    );
};

export default FilterSidebar;