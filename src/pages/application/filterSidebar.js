import React, { useMemo, useState } from 'react';
import { Select, Tag, Spin, DatePicker } from 'antd';
import dayjs from 'dayjs';
import Button from '@/components/Button';
import { Info, MapPin, Briefcase, Brain, X, Languages, CalendarDays } from 'lucide-react';
import { useGetSkillsQuery } from '@/apis/skillApi';
import { useGetCompanyLocationQuery } from '@/apis/companyApi';

const DEFAULT_FILTERS = {
    status: undefined,
    locationId: undefined,
    matchLevel: undefined,
    candidateLevels: [],
    language: undefined,
    appliedFrom: undefined,
    appliedTo: undefined,
    skills: [],
};

const CANDIDATE_LEVEL_OPTIONS = [
    { value: 'INTERN', label: 'Intern' },
    { value: 'FRESHER', label: 'Fresher' },
    { value: 'JUNIOR', label: 'Junior' },
    { value: 'MIDDLE', label: 'Middle' },
    { value: 'SENIOR', label: 'Senior' },
    { value: 'LEAD', label: 'Lead' },
    { value: 'MANAGER', label: 'Manager' },
];

const normalize = (current) => ({
    ...DEFAULT_FILTERS,
    ...current,
    skills: Array.isArray(current?.skills) ? current.skills : [],
    candidateLevels: Array.isArray(current?.candidateLevels) ? current.candidateLevels : [],
});

const FilterSidebar = ({ onApply, onClose, currentFilters }) => {
    const [filters, setFilters] = useState(() => normalize(currentFilters));
    const [searchValue, setSearchValue] = useState('');

    const { data: skillList, isFetching: isLoadingSkills } = useGetSkillsQuery({ size: 100 });
    const { data: locations = [], isLoading: isLoadingLocations } = useGetCompanyLocationQuery();

    const skillOptions = skillList?.map(skill => ({
        label: skill.name,
        value: skill.name
    })) || [];

    const locationOptions = useMemo(
        () => locations.map(loc => {
            const detail = [loc.city, loc.country].filter(Boolean).join(', ');
            const name = loc.name || loc.address || `Location #${loc.id}`;
            return {
                value: loc.id,
                label: detail ? `${name} — ${detail}` : name,
            };
        }),
        [locations]
    );

    const activeCount = useMemo(() => {
        let count = 0;
        if (filters.status) count += 1;
        if (filters.locationId) count += 1;
        if (filters.matchLevel) count += 1;
        if (filters.candidateLevels?.length) count += 1;
        if (filters.language) count += 1;
        if (filters.appliedFrom || filters.appliedTo) count += 1;
        if (filters.skills?.length) count += 1;
        return count;
    }, [filters]);

    const addSkill = (value) => {
        const trimmedValue = value?.trim();
        if (trimmedValue && !filters.skills.includes(trimmedValue)) {
            setFilters(prev => ({ ...prev, skills: [...prev.skills, trimmedValue] }));
            setSearchValue('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && searchValue) {
            addSkill(searchValue);
        }
    };

    const handleRemoveSkill = (removedSkill) => {
        setFilters({
            ...filters,
            skills: filters.skills.filter(s => s !== removedSkill)
        });
    };

    const handleReset = () => {
        setFilters(DEFAULT_FILTERS);
        onApply(DEFAULT_FILTERS);
        onClose?.();
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-surface-dark font-body">
            <div className="flex-1 overflow-y-auto pb-6 custom-scrollbar">
                <div className="flex items-center justify-between mb-5">
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Refine your candidate list using advanced parameters.
                    </p>
                    {activeCount > 0 && (
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                                {activeCount} active
                            </span>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="text-xs font-medium text-primary hover:underline"
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </div>

                {/* Group: Basics */}
                <div className="space-y-6">
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
                                { value: 'REJECTED', label: 'Rejected' },
                                { value: 'APPROVED', label: 'Approved' },
                            ]}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-neutral-900 dark:text-white font-semibold text-sm">
                            <MapPin size={14} className="text-primary" /> Company Location
                        </label>
                        <Select
                            className="w-full custom-select-filter"
                            placeholder="All Locations"
                            value={filters.locationId}
                            allowClear
                            showSearch
                            optionFilterProp="label"
                            loading={isLoadingLocations}
                            onChange={(val) => setFilters({ ...filters, locationId: val ?? undefined })}
                            options={locationOptions}
                            notFoundContent={isLoadingLocations ? <Spin size="small" /> : 'No locations'}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-neutral-900 dark:text-white font-semibold text-sm">
                            <CalendarDays size={14} className="text-primary" /> Applied Date
                        </label>
                        <DatePicker.RangePicker
                            className="w-full"
                            value={[
                                filters.appliedFrom ? dayjs(filters.appliedFrom) : null,
                                filters.appliedTo ? dayjs(filters.appliedTo) : null,
                            ]}
                            allowEmpty={[true, true]}
                            onChange={(dates) => setFilters({
                                ...filters,
                                appliedFrom: dates?.[0] ? dates[0].format('YYYY-MM-DD') : undefined,
                                appliedTo: dates?.[1] ? dates[1].format('YYYY-MM-DD') : undefined,
                            })}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-neutral-900 dark:text-white font-semibold text-sm">
                            <Languages size={14} className="text-primary" /> Resume Language
                        </label>
                        <Select
                            className="w-full"
                            placeholder="Any Language"
                            value={filters.language}
                            allowClear
                            onChange={(val) => setFilters({ ...filters, language: val })}
                            options={[
                                { value: 'ENGLISH', label: 'English' },
                                { value: 'VIETNAMESE', label: 'Vietnamese' },
                            ]}
                        />
                    </div>
                </div>

                <div className="my-6 border-t border-neutral-100 dark:border-neutral-800" />

                {/* Group: AI & Skills */}
                <div className="space-y-6">
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

                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-neutral-900 dark:text-white font-semibold text-sm">
                            <Brain size={14} className="text-primary" /> Candidate Level (AI)
                        </label>
                        <Select
                            mode="multiple"
                            className="w-full"
                            placeholder="Any Seniority"
                            value={filters.candidateLevels}
                            allowClear
                            onChange={(val) => setFilters({ ...filters, candidateLevels: val || [] })}
                            options={CANDIDATE_LEVEL_OPTIONS}
                            maxTagCount="responsive"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-neutral-900 dark:text-white font-semibold text-sm">
                            <Briefcase size={14} className="text-primary" /> Required Skills
                        </label>

                        <Select
                            showSearch
                            className="w-full"
                            placeholder="Search or type new skill..."
                            optionFilterProp="label"
                            loading={isLoadingSkills}
                            onSelect={(val) => addSkill(val)}
                            onSearch={(val) => setSearchValue(val)}
                            onInputKeyDown={handleKeyDown}
                            searchValue={searchValue}
                            value={null}
                            options={skillOptions}
                            suffixIcon={isLoadingSkills ? <Spin size="small" /> : null}
                            notFoundContent={searchValue ? (
                                <div className="p-2 text-xs text-gray-400 italic">
                                    Press Enter to add "{searchValue}"
                                </div>
                            ) : null}
                        />

                        {filters.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {filters.skills.map(skill => (
                                    <Tag
                                        key={skill}
                                        closable
                                        onClose={() => handleRemoveSkill(skill)}
                                        className="bg-orange-50 border-orange-100 text-orange-600 font-medium rounded-lg px-2 py-1 flex items-center gap-1 m-0"
                                        closeIcon={<X size={10} />}
                                    >
                                        {skill.toUpperCase()}
                                    </Tag>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

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
