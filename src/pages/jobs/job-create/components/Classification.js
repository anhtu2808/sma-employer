import React from 'react';
import { Select, Input } from 'antd';

const Classification = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-icons-round text-orange-500">category</span>
                Classification & Skills
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Primary Expertise
                    </label>
                    <Select placeholder="Design & Creative" className="w-full h-10" options={[{ value: 'design', label: 'Design & Creative' }, { value: 'dev', label: 'Development' }]} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Industry Domain
                    </label>
                    <Select placeholder="SaaS" className="w-full h-10" options={[{ value: 'saas', label: 'SaaS' }, { value: 'fintech', label: 'Fintech' }]} />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Skills (Tags)
                </label>
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 flex flex-wrap gap-2">
                    <div className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        Figma <button className="hover:text-orange-800">×</button>
                    </div>
                    <div className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        Prototyping <button className="hover:text-orange-800">×</button>
                    </div>
                    <input type="text" placeholder="Type and press Enter..." className="flex-1 outline-none bg-transparent min-w-[150px] text-sm" />
                </div>
            </div>
        </div>
    );
};

export default Classification;
