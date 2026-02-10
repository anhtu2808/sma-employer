import React from 'react';
import { Input, InputNumber, Select, Radio } from 'antd';

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
                            <Input prefix="$" placeholder="Min" className="rounded-lg" />
                            <span>-</span>
                            <Input prefix="$" placeholder="Max" className="rounded-lg" />
                        </div>
                    </div>
                    <Select defaultValue="USD ($)" className="w-full h-10" options={[{ value: 'USD ($)', label: 'USD ($)' }, { value: 'VND (₫)', label: 'VND (₫)' }]} />
                </div>

                {/* Column 2 */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Years of Experience
                        </label>
                        <div className="flex items-center gap-2">
                            <InputNumber placeholder="Min" className="w-full rounded-lg py-1" />
                            <span>-</span>
                            <InputNumber placeholder="Max" className="w-full rounded-lg py-1" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Job Level
                        </label>
                        <Select placeholder="Senior" className="w-full h-10" options={[{ value: 'Junior', label: 'Junior' }, { value: 'Senior', label: 'Senior' }, { value: 'Lead', label: 'Lead' }]} />
                    </div>
                </div>

                {/* Column 3 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Working Model
                    </label>
                    <Radio.Group className="flex flex-col gap-3">
                        <Radio value="remote">
                            <span className="font-medium">Remote</span> - <span className="text-gray-500">Work from anywhere</span>
                        </Radio>
                        <Radio value="onsite">
                            <span className="font-medium">On-site</span> - <span className="text-gray-500">100% in office</span>
                        </Radio>
                        <Radio value="hybrid">
                            <span className="font-medium">Hybrid</span> - <span className="text-gray-500">2-3 days in office</span>
                        </Radio>
                    </Radio.Group>
                </div>
            </div>
        </div>
    );
};

export default RoleDetails;
