import React from 'react';
import { Form } from 'antd';
import TiptapEditor from '@/components/TiptapEditor';
import SimpleTextEditor from '@/components/SimpleTextEditor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines } from '../../../../utils/icons';

const JobDescriptionSection = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faFileLines} className="text-orange-500" />
                About the Role
            </h3>

            <div>
                <Form.Item name="about" className="mb-0">
                    <SimpleTextEditor placeholder="Describe the role, responsibilities, and what you're looking for..." />
                </Form.Item>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <Form.Item name="responsibilities" label={<span className="text-base font-semibold">Responsibilities</span>} className="mb-0">
                    <SimpleTextEditor placeholder="List key duties..." showCount maxLength={5000} />
                </Form.Item>

                <Form.Item name="requirement" label={<span className="text-base font-semibold">Requirements</span>} className="mb-0">
                    <SimpleTextEditor placeholder="List qualifications..." showCount maxLength={5000} />
                </Form.Item>
            </div>
        </div>
    );
};

export default JobDescriptionSection;
