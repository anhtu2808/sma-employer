import React, { useState } from 'react';
import { Slider, Select, Space } from 'antd';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Checkbox from '@/components/Checkbox';

const FilterSidebar = ({ onApply, onReset }) => {
    const [filters, setFilters] = useState({
        status: 'All Statuses',
        location: 'All Cities',
        experience: [0, 10],
        salary: [0, 10000],
        minScore: 0,
        skills: []
    });

    const handleSkillAdd = (skill) => {
        if (!filters.skills.includes(skill)) {
            setFilters({ ...filters, skills: [...filters.skills, skill] });
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-surface-dark font-body">
            <div className="flex-1 overflow-y-auto space-y-8 pb-6">
                <p className="text-neutral-500 text-sm leading-relaxed">
                    Narrow down your search to find the perfect candidates.
                </p>

                {/* Status Filter */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px]">
                        <span className="material-icons-round text-base">info_outline</span> Status
                    </label>
                    <Select
                        className="w-full custom-select"
                        defaultValue="All Statuses"
                        onChange={(value) => setFilters({ ...filters, status: value })}
                        options={[
                            { value: 'All Statuses', label: 'All Statuses' },
                            { value: 'APPLIED', label: 'Applied' },
                            { value: 'IN_REVIEW', label: 'In Review' },
                            { value: 'INTERVIEW', label: 'Interview' },
                            { value: 'HIRED', label: 'Hired' },
                        ]}
                    />
                </div>

                {/* Location Filter */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px]">
                        <span className="material-icons-round text-base">location_on</span> Location
                    </label>
                    <Select
                        className="w-full custom-select"
                        defaultValue="All Cities"
                        onChange={(value) => setFilters({ ...filters, location: value })}
                        options={[
                            { value: 'All Cities', label: 'All Cities' },
                            { value: 'Hồ Chí Minh', label: 'Ho Chi Minh City' },
                            { value: 'Hà Nội', label: 'Ha Noi' },
                            { value: 'Đà Nẵng', label: 'Da Nang' },
                        ]}
                    />
                </div>

                {/* Years of Experience Slider */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px]">
                            <span className="material-icons-round text-base">work_outline</span> Years of Experience
                        </label>
                    </div>
                    <Slider
                        range
                        defaultValue={[0, 10]}
                        max={15}
                        onChange={(val) => setFilters({ ...filters, experience: val })}
                        trackStyle={{ backgroundColor: '#FF6B35' }}
                        handleStyle={{ borderColor: '#FF6B35' }}
                    />
                    <div className="flex justify-between text-[11px] font-bold text-neutral-400">
                        <span>0 years</span>
                        <span>10+ years</span>
                    </div>
                </div>

                {/* Expected Salary Range */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px]">
                        <span className="material-icons-round text-base">monetization_on</span> Expected Salary Range (USD)
                    </label>
                    <Slider
                        range
                        step={500}
                        max={10000}
                        defaultValue={[0, 10000]}
                        onChange={(val) => setFilters({ ...filters, salary: val })}
                        trackStyle={{ backgroundColor: '#FF6B35' }}
                    />
                    <div className="flex justify-between text-[11px] font-bold text-neutral-400">
                        <span>$0</span>
                        <span>$10,000+</span>
                    </div>
                </div>

                {/* Minimum Match Score */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px]">
                        <span className="material-icons-round text-base">psychology</span> Minimum Match Score
                    </label>
                    <Slider
                        defaultValue={0}
                        onChange={(val) => setFilters({ ...filters, minScore: val })}
                        trackStyle={{ backgroundColor: '#22C55E' }}
                    />
                    <div className="flex justify-between text-[11px] font-bold text-neutral-400">
                        <span>0%</span>
                        <span>100%</span>
                    </div>
                </div>

                {/* Required Skills */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px]">
                        <span className="material-icons-round text-base">bolt</span> Required Skills
                    </label>
                    <div className="flex gap-2">
                        <Input placeholder="Add a skill..." className="flex-1" size="small" />
                        <Button mode="primary" size="sm">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                        <span className="text-[10px] text-neutral-400 font-medium">Quick add:</span>
                        {['Marketing', 'Sales', 'Finance', 'Design'].map(skill => (
                            <button
                                key={skill}
                                onClick={() => handleSkillAdd(skill)}
                                className="text-[10px] font-bold text-green-600 hover:underline bg-transparent border-0 p-0 cursor-pointer"
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-2 gap-4">
                <Button mode="secondary" fullWidth onClick={onReset}>Reset</Button>
                <Button mode="primary" fullWidth onClick={() => onApply(filters)}>Apply Filter</Button>
            </div>
        </div>
    );
};

export default FilterSidebar;