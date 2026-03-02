import React, { useEffect, useMemo, useState } from 'react';
import { Drawer, InputNumber, Select, message } from 'antd';
import Button from '@/components/Button';
import { WORKING_MODEL_OPTIONS, JOB_LEVEL_OPTIONS } from '@/constrant';
import { useGetCompanyLocationQuery } from '@/apis/companyApi';
import { useGetDomainQuery, useGetExpertiseQuery } from '@/apis/masterDataApi';
import { useGetSkillsQuery } from '@/apis/skillApi';

const createDefaultFilters = () => ({
    workingModel: null,
    jobLevel: null,
    locationId: null,
    expertiseId: null,
    domainId: [],
    skillId: [],
    salaryStart: null,
    salaryEnd: null,
    minExperienceTime: null,
    maxExperienceTime: null,
});

const normalizeFilters = (filters) => ({
    ...createDefaultFilters(),
    ...filters,
    domainId: Array.isArray(filters?.domainId) ? filters.domainId : [],
    skillId: Array.isArray(filters?.skillId) ? filters.skillId : [],
});

const isValidNumber = (value) => typeof value === 'number' && !Number.isNaN(value);

const JobFilterDrawer = ({ open, onClose, initialFilters, onApply, onReset }) => {
    const [draftFilters, setDraftFilters] = useState(() => normalizeFilters(initialFilters));
    const [skillSearchInput, setSkillSearchInput] = useState('');
    const [skillSearch, setSkillSearch] = useState('');

    const { data: locations = [], isLoading: isLocationLoading } = useGetCompanyLocationQuery();
    const { data: expertise = [], isLoading: isExpertiseLoading } = useGetExpertiseQuery();
    const { data: domain = [], isLoading: isDomainLoading } = useGetDomainQuery();
    const { data: skills = [], isLoading: isSkillsLoading, isFetching: isSkillsFetching } = useGetSkillsQuery({
        name: skillSearch || undefined,
        page: 0,
        size: 100,
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setSkillSearch(skillSearchInput.trim());
        }, 300);

        return () => clearTimeout(timer);
    }, [skillSearchInput]);

    useEffect(() => {
        if (!open) return;
        setDraftFilters(normalizeFilters(initialFilters));
        setSkillSearchInput('');
        setSkillSearch('');
    }, [open, initialFilters]);

    const locationOptions = useMemo(
        () =>
            locations.map((location) => ({
                value: location.id,
                label: `${location.name} - ${location.city}, ${location.country}`,
            })),
        [locations],
    );

    const expertiseOptions = useMemo(
        () =>
            expertise.map((item) => ({
                value: item.id,
                label: item.name,
            })),
        [expertise],
    );

    const domainOptions = useMemo(
        () =>
            domain.map((item) => ({
                value: item.id,
                label: item.name,
            })),
        [domain],
    );

    const skillOptions = useMemo(
        () =>
            skills.map((item) => ({
                value: item.id,
                label: item.name,
            })),
        [skills],
    );

    const updateField = (key, value) => {
        setDraftFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleApply = () => {
        if (
            isValidNumber(draftFilters.salaryStart)
            && isValidNumber(draftFilters.salaryEnd)
            && draftFilters.salaryStart > draftFilters.salaryEnd
        ) {
            message.error('Salary start must be less than or equal to salary end.');
            return;
        }

        if (
            isValidNumber(draftFilters.minExperienceTime)
            && isValidNumber(draftFilters.maxExperienceTime)
            && draftFilters.minExperienceTime > draftFilters.maxExperienceTime
        ) {
            message.error('Min experience must be less than or equal to max experience.');
            return;
        }

        onApply(normalizeFilters(draftFilters));
    };

    const handleReset = () => {
        setDraftFilters(createDefaultFilters());
        setSkillSearchInput('');
        setSkillSearch('');
        onReset();
    };

    return (
        <Drawer
            title={<span className="font-heading font-bold text-lg">Filter Jobs</span>}
            placement="right"
            open={open}
            onClose={onClose}
            width={480}
            className="custom-drawer"
        >
            <div className="flex h-full flex-col">
                <div className="flex-1 overflow-y-auto space-y-6 pr-1">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-200">Working Model</label>
                        <Select
                            className="w-full"
                            placeholder="All Working Models"
                            allowClear
                            value={draftFilters.workingModel}
                            onChange={(value) => updateField('workingModel', value ?? null)}
                            options={WORKING_MODEL_OPTIONS}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-200">Job Level</label>
                        <Select
                            className="w-full"
                            placeholder="All Job Levels"
                            allowClear
                            value={draftFilters.jobLevel}
                            onChange={(value) => updateField('jobLevel', value ?? null)}
                            options={JOB_LEVEL_OPTIONS}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-200">Location</label>
                        <Select
                            className="w-full"
                            placeholder="All Locations"
                            allowClear
                            loading={isLocationLoading}
                            value={draftFilters.locationId}
                            onChange={(value) => updateField('locationId', value ?? null)}
                            options={locationOptions}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-200">Expertise</label>
                        <Select
                            className="w-full"
                            placeholder="All Expertise"
                            allowClear
                            loading={isExpertiseLoading}
                            value={draftFilters.expertiseId}
                            onChange={(value) => updateField('expertiseId', value ?? null)}
                            options={expertiseOptions}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-200">Domains</label>
                        <Select
                            mode="multiple"
                            className="w-full"
                            placeholder="Select domains"
                            allowClear
                            loading={isDomainLoading}
                            value={draftFilters.domainId}
                            onChange={(value) => updateField('domainId', value || [])}
                            options={domainOptions}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-200">Skills</label>
                        <Select
                            mode="multiple"
                            className="w-full"
                            placeholder="Select skills"
                            value={draftFilters.skillId}
                            filterOption={false}
                            allowClear
                            showSearch
                            onSearch={setSkillSearchInput}
                            onChange={(value) => updateField('skillId', value || [])}
                            loading={isSkillsLoading || isSkillsFetching}
                            options={skillOptions}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-200">Salary Range</label>
                        <div className="grid grid-cols-2 gap-3">
                            <InputNumber
                                className="w-full"
                                min={0}
                                placeholder="Min salary"
                                value={draftFilters.salaryStart}
                                onChange={(value) => updateField('salaryStart', value ?? null)}
                            />
                            <InputNumber
                                className="w-full"
                                min={0}
                                placeholder="Max salary"
                                value={draftFilters.salaryEnd}
                                onChange={(value) => updateField('salaryEnd', value ?? null)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-200">Experience (years)</label>
                        <div className="grid grid-cols-2 gap-3">
                            <InputNumber
                                className="w-full"
                                min={0}
                                placeholder="Min years"
                                value={draftFilters.minExperienceTime}
                                onChange={(value) => updateField('minExperienceTime', value ?? null)}
                            />
                            <InputNumber
                                className="w-full"
                                min={0}
                                placeholder="Max years"
                                value={draftFilters.maxExperienceTime}
                                onChange={(value) => updateField('maxExperienceTime', value ?? null)}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-neutral-800">
                    <Button mode="secondary" shape="round" onClick={handleReset}>
                        Reset
                    </Button>
                    <Button mode="primary" shape="round" onClick={handleApply}>
                        Apply Filter
                    </Button>
                </div>
            </div>
        </Drawer>
    );
};

export default JobFilterDrawer;
