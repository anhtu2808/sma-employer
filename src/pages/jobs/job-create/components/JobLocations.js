import React from 'react';
import { Input, Tag } from 'antd';

const JobLocations = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-icons-round text-orange-500">location_on</span>
                Locations
            </h3>

            <Input prefix={<span className="material-icons-round text-gray-400">search</span>} placeholder="Search city or country..." className="rounded-lg py-2" />

            <div className="flex flex-wrap gap-2 mt-2">
                <Tag closeIcon closable className="bg-gray-100 border-gray-200 py-1 px-3 rounded-full flex items-center gap-2 text-base">
                    <span>🇺🇸</span> New York, USA
                </Tag>
            </div>
            <div className="h-32 bg-gray-50 dark:bg-gray-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 text-sm">
                Map Preview
            </div>
        </div>
    );
};

export default JobLocations;
