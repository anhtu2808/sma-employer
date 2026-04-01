import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Select, Form } from 'antd';
import { useGetSkillsQuery } from '@/apis/skillApi';
import { debounce } from 'lodash';
import { useGetExpertiseGroupQuery, useGetExpertiseQuery, useGetDomainQuery } from '@/apis/masterDataApi';
import BenefitsManager from './BenefitsManager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup } from '../../../../utils/icons';

const Classification = () => {
    const form = Form.useFormInstance();
    const isFirstRender = useRef(true);

    const [skillSearch, setSkillSearch] = useState('');
    const { data: skills = [], isLoading: skillsLoading, isFetching: skillsFetching } = useGetSkillsQuery({ name: skillSearch || undefined, size: 200 });
    const { data: expertiseGroups = [], isLoading: groupsLoading } = useGetExpertiseGroupQuery({ size: 200 });
    const { data: expertise = [], isLoading: expertiseLoading } = useGetExpertiseQuery({ size: 200 });
    const { data: domain = [], isLoading: domainLoading } = useGetDomainQuery({ size: 200 });

    const selectedGroupId = Form.useWatch('expertiseGroupId', form);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        form.setFieldValue('expertiseId', undefined);
    }, [selectedGroupId, form]);

    const skillOptions = skills.map((skill) => ({
        value: skill.id,
        label: skill.name,
    }));

    const expertiseGroupOptions = expertiseGroups.map((group) => ({
        value: group.id,
        label: group.name,
    }));

    const expertiseOptions = useMemo(() => {
        if (!selectedGroupId) return [];
        return expertise
            .filter(e => e.expertiseGroup?.id === selectedGroupId)
            .map(e => ({ value: e.id, label: e.name }));
    }, [selectedGroupId, expertise]);

    const domainOptions = domain.map((d) => ({
        value: d.id,
        label: d.name,
    }));

    const handleSkillSearch = useMemo(
        () => debounce((value) => setSkillSearch(value), 300),
        []
    );

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faLayerGroup} className="text-orange-500" />
                Classification & Skills
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item name="expertiseGroupId" label="Expertise Group" className="mb-0">
                    <Select
                        placeholder="Select a group..."
                        className="w-full h-10"
                        showSearch
                        allowClear
                        filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                        loading={groupsLoading}
                        options={expertiseGroupOptions}
                    />
                </Form.Item>
                <Form.Item name="expertiseId" label="Primary Expertise" className="mb-0">
                    <Select
                        placeholder={selectedGroupId ? 'Select expertise...' : 'Select a group first'}
                        className="w-full h-10"
                        showSearch
                        allowClear
                        filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                        loading={expertiseLoading}
                        disabled={!selectedGroupId}
                        options={expertiseOptions}
                    />
                </Form.Item>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <Form.Item name="domainIds" label="Industry Domain" className="mb-0">
                    <Select
                        mode="multiple"
                        placeholder="SaaS"
                        className="w-full h-10"
                        showSearch
                        filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                        loading={domainLoading}
                        options={domainOptions}
                    />
                </Form.Item>
            </div>

            <Form.Item name="skillIds" label="Skills (Tags)" className="mb-0">
                <Select
                    mode="multiple"
                    placeholder="Select skills..."
                    className="w-full"
                    showSearch
                    filterOption={false}
                    onSearch={handleSkillSearch}
                    loading={skillsLoading || skillsFetching}
                    options={skillOptions}
                />
            </Form.Item>

            <BenefitsManager />
        </div>
    );
};

export default Classification;
