import React from 'react';
import { Tag } from 'antd';

const JobExpertise = ({ expertise }) => {
    if (!expertise) return null;

    return (
        <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Job Expertise:</h3>
            <Tag className="bg-blue-50 text-blue-600 border-blue-100 px-3 py-1 text-sm rounded-full m-0">
                {expertise.name}
            </Tag>
        </div>
    );
};

export default JobExpertise;
