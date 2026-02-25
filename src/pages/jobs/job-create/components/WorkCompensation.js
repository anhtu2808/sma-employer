import React from 'react';
import { Form, Input, Select, InputNumber } from 'antd';

const WorkCompensation = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-icons-round text-orange-500">work_outline</span>
                Work & Compensation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item name="jobLevel" label="Job Position" className="mb-0">
                    <Select placeholder="Select level" className="w-full" options={[
                        { value: 'INTERN', label: 'Intern' },
                        { value: 'FRESHER', label: 'Fresher' },
                        { value: 'JUNIOR', label: 'Junior' },
                        { value: 'MIDDLE', label: 'Middle' },
                        { value: 'SENIOR', label: 'Senior' },
                        { value: 'LEAD', label: 'Lead' },
                    ]} />
                </Form.Item>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Experience (Years)
                    </label>
                    <Form.Item name="experienceTime" noStyle>
                        <InputNumber placeholder="e.g. 3" className="w-full" min={0} />
                    </Form.Item>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Salary Range (Annual)
                    </label>
                    <div className="flex gap-2">
                        <Form.Item name="salaryStart" noStyle>
                            <Input prefix="$" placeholder="Min" />
                        </Form.Item>
                        <span className="self-center text-gray-400">-</span>
                        <Form.Item name="salaryEnd" noStyle>
                            <Input prefix="$" placeholder="Max" />
                        </Form.Item>
                        <Form.Item name="currency" noStyle initialValue="VND">
                            <Select style={{ width: 80 }} options={[{ value: 'VND', label: 'VND' }, { value: 'USD', label: 'USD' }]} />
                        </Form.Item>
                    </div>
                </div>

                <Form.Item name="employmentType" label="Employment Type" initialValue="FULL_TIME" className="mb-0">
                    <Select options={[
                        { value: 'FULL_TIME', label: 'Full-time' },
                        { value: 'PART_TIME', label: 'Part-time' },
                        { value: 'CONTRACT', label: 'Contract' },
                        { value: 'FREELANCE', label: 'Freelance' },
                        { value: 'INTERNSHIP', label: 'Internship' }
                    ]} />
                </Form.Item>

                <div className="md:col-span-2">
                    <Form.Item name="workingModel" label="Working Time/Model" initialValue="ONSITE" className="mb-0">
                        <Select options={[
                            { value: 'ONSITE', label: 'Standard Office Hours (Mon-Fri) - Onsite' },
                            { value: 'REMOTE', label: 'Flexible - Remote' },
                            { value: 'HYBRID', label: 'Hybrid (Part-time Office)' }
                        ]} />
                    </Form.Item>
                </div>
            </div>
        </div>
    );
};

export default WorkCompensation;
