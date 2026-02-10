import React from 'react';
import { DatePicker, InputNumber, Slider } from 'antd';

const JobSettings = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-icons-round text-orange-500">tune</span>
                Job Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Application Deadline
                    </label>
                    <DatePicker className="w-full rounded-lg py-2" format="MM/DD/YYYY" placeholder="mm/dd/yyyy" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Number of Openings
                    </label>
                    <InputNumber className="w-full rounded-lg py-1.5" min={1} defaultValue={1} />
                </div>
            </div>

            <div>
                <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Auto-Reject Threshold
                    </label>
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">Below 40%</span>
                </div>
                <Slider defaultValue={40} trackStyle={{ backgroundColor: '#F97316' }} handleStyle={{ borderColor: '#F97316', backgroundColor: '#F97316' }} />
                <p className="text-xs text-gray-500">Candidates scoring below this will be automatically moved to 'Rejected'.</p>
            </div>
        </div>
    );
};

export default JobSettings;
