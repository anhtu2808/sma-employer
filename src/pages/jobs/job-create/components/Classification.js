import React from 'react';
import { Select, Input, Form } from 'antd';

const Classification = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-icons-round text-orange-500">category</span>
                Classification & Skills
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item name="expertiseId" label="Primary Expertise" className="mb-0">
                    <Select placeholder="Design & Creative" className="w-full h-10" options={[{ value: 1, label: 'Design & Creative' }, { value: 2, label: 'Development' }]} />
                </Form.Item>
                <Form.Item name="domainIds" label="Industry Domain" className="mb-0">
                    <Select mode="multiple" placeholder="SaaS" className="w-full h-10" options={[{ value: 1, label: 'SaaS' }, { value: 2, label: 'Fintech' }]} />
                </Form.Item>
            </div>

            <Form.Item name="skillIds" label="Skills (Tags)" className="mb-0">
                <Select mode="multiple" placeholder="Select skills..." className="w-full" options={[{ value: 1, label: 'Figma' }, { value: 2, label: 'React' }, { value: 3, label: 'Java' }]} />
            </Form.Item>

            <Form.Item name="benefitIds" label="Benefits" className="mb-0">
                <Select mode="multiple" placeholder="Select benefits..." className="w-full" options={[{ value: 1, label: 'Remote Work' }, { value: 2, label: 'Health Insurance' }]} />
            </Form.Item>
        </div>
    );
};

export default Classification;
