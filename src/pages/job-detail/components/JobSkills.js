import React from 'react';
import { Tag } from 'antd';

const JobSkills = ({ skills }) => {
    if (!skills || skills.length === 0) return null;

    return (
        <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Skills:</h3>
            <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                    <Tag key={skill.id} className="bg-gray-100 text-gray-600 border-gray-200 px-3 py-1 text-sm rounded-full m-0">
                        {skill.name}
                    </Tag>
                ))}
            </div>
        </div>
    );
};

export default JobSkills;
