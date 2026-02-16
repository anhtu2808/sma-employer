import React from 'react';
import { Form, Select, InputNumber } from 'antd';

const RoleDefinition = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-icons-round text-orange-500">location_on</span>
                Role Definition
            </h3>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                    <button type="button" className="text-xs font-medium text-primary hover:underline">Use Company Address</button>
                </div>
                <Form.Item name="locationIds" className="mb-0">
                    <Select
                        mode="multiple"
                        placeholder="Select locations..."
                        className="w-full"
                        options={[
                            { value: 1, label: 'Hanoi (Headquarters)' },
                            { value: 2, label: 'Ho Chi Minh City' },
                            { value: 3, label: 'Da Nang' },
                            { value: 4, label: 'Remote' }
                        ]}
                    />
                </Form.Item>
            </div>


        </div>
    );
};

export default RoleDefinition;
