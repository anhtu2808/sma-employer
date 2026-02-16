import React from 'react';
import { Tag } from 'antd';

const JobSkills = ({ skills }) => {
    if (!skills || skills.length === 0) return null;

    return (
        <div className="mb-6">
            <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                    <Tag key={skill.id} color="orange" className="px-3 py-1 text-sm rounded-full m-0">
                        {skill.name}
                    </Tag>
                ))}
            </div>
        </div>
    );
};

export default JobSkills;
