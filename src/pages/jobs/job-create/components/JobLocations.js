import React from 'react';
import { Input, Tag, Form, Select } from 'antd';

const JobLocations = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-icons-round text-orange-500">location_on</span>
                Locations
            </h3>

            <Form.Item name="locationIds" label="Locations" className="mb-0">
                <Select
                    mode="multiple"
                    placeholder="Select locations..."
                    className="w-full"
                    options={[
                        { value: 1, label: 'Hanoi (Headquarters)' },
                        { value: 2, label: 'Ho Chi Minh City' },
                        { value: 3, label: 'Da Nang' }
                    ]}
                />
            </Form.Item>
            <div className="h-32 bg-gray-50 dark:bg-gray-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 text-sm">
                Map Preview
            </div>
        </div>
    );
};

export default JobLocations;
