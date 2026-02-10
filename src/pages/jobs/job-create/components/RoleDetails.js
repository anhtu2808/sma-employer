import React from 'react';
import { Input, InputNumber, Select, Radio, Form } from 'antd';

const RoleDetails = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-icons-round text-orange-500">work</span>
                Role Details & Compensation
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1 */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Salary Range (Annual)
                        </label>
                        <div className="flex items-center gap-2">
                            <Form.Item name="salaryStart" noStyle>
                                <Input prefix="$" placeholder="Min" className="rounded-lg" />
                            </Form.Item>
                            <span>-</span>
                            <Form.Item name="salaryEnd" noStyle>
                                <Input prefix="$" placeholder="Max" className="rounded-lg" />
                            </Form.Item>
                        </div>
                    </div>
                    <Form.Item name="currency" initialValue="VND">
                        <Select className="w-full h-10" options={[{ value: 'USD', label: 'USD ($)' }, { value: 'VND', label: 'VND (₫)' }]} />
                    </Form.Item>
                </div>

                {/* Column 2 */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Years of Experience
                        </label>
                        <div className="flex items-center gap-2">
                            <Form.Item name="experienceTime" noStyle>
                                <InputNumber placeholder="Years" className="w-full rounded-lg py-1" />
                            </Form.Item>
                        </div>
                    </div>
                    <Form.Item name="jobLevel" label="Job Level" className="mb-0">
                        <Select placeholder="Select level" className="w-full h-10" options={[{ value: 'INTERN', label: 'Intern' }, { value: 'FRESHER', label: 'Fresher' }, { value: 'JUNIOR', label: 'Junior' }, { value: 'MIDDLE', label: 'Middle' }, { value: 'SENIOR', label: 'Senior' }, { value: 'LEAD', label: 'Lead' }, { value: 'MANAGER', label: 'Manager' }, { value: 'DIRECTOR', label: 'Director' }]} />
                    </Form.Item>
                </div>

                {/* Column 3 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Working Model
                    </label>
                    <Form.Item name="workingModel" initialValue="ONSITE">
                        <Radio.Group className="flex flex-col gap-3">
                            <Radio value="REMOTE">
                                <span className="font-medium">Remote</span> - <span className="text-gray-500">Work from anywhere</span>
                            </Radio>
                            <Radio value="ONSITE">
                                <span className="font-medium">On-site</span> - <span className="text-gray-500">100% in office</span>
                            </Radio>
                            <Radio value="HYBRID">
                                <span className="font-medium">Hybrid</span> - <span className="text-gray-500">2-3 days in office</span>
                            </Radio>
                        </Radio.Group>
                    </Form.Item>
                </div>
            </div>
        </div>
    );
};

export default RoleDetails;
