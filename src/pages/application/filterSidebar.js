import React, { useState } from 'react';
import { Slider, Select, Tag, Spin } from 'antd';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { Info, MapPin, Briefcase, DollarSign, Brain, Zap, X } from 'lucide-react';
import { useGetSkillsQuery } from '@/apis/skillApi';

const FilterSidebar = ({ onApply, onReset, currentFilters }) => {
    const [filters, setFilters] = useState({
        status: currentFilters?.status || undefined,
        location: currentFilters?.location || undefined,
        matchLevel: currentFilters?.matchLevel || undefined,
        minScore: currentFilters?.minScore || undefined,
        skills: currentFilters?.skills || []
    });

    const [searchValue, setSearchValue] = useState(''); // Lưu giá trị người dùng đang gõ

    const { data: skillList, isFetching: isLoadingSkills } = useGetSkillsQuery({ size: 100 });

    const skillOptions = skillList?.map(skill => ({
        label: skill.name,
        value: skill.name
    })) || [];

    // Hàm thêm skill chung (dùng cho cả chọn từ list và tự nhập)
    const addSkill = (value) => {
        const trimmedValue = value?.trim();
        if (trimmedValue && !filters.skills.includes(trimmedValue)) {
            setFilters(prev => ({ ...prev, skills: [...prev.skills, trimmedValue] }));
            setSearchValue(''); // Xóa nội dung đang gõ sau khi thêm thành công
        }
    };

    // Xử lý khi nhấn phím Enter trong ô Select
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
        const resetState = {
            status: undefined, location: undefined, matchLevel: undefined, minScore: undefined, skills: []
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
                            { value: 'REJECTED', label: 'Rejected' },
                            { value: 'APPROVED', label: 'Approved' },
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

                {/* Required Skills Section */}
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
                        onSelect={(val) => addSkill(val)} // Khi click chọn từ list
                        onSearch={(val) => setSearchValue(val)} // Cập nhật giá trị khi đang gõ
                        onInputKeyDown={handleKeyDown} // Bắt sự kiện Enter để thêm skill lạ
                        searchValue={searchValue} // Liên kết state search
                        value={null}
                        options={skillOptions}
                        suffixIcon={isLoadingSkills ? <Spin size="small" /> : null}
                        notFoundContent={searchValue ? (
                            <div className="p-2 text-xs text-gray-400 italic">
                                Press Enter to add "{searchValue}"
                            </div>
                        ) : null}
                    />

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