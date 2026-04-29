import React from 'react';
import { Form } from 'antd';
import TiptapEditor from '@/components/TiptapEditor';
import SimpleTextEditor from '@/components/SimpleTextEditor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines } from '../../../../utils/icons';

// Validator for rich-text fields: strips HTML tags and checks for actual text
const richTextRequired = (message) => ({
    validator: (_, value) => {
        if (!value) return Promise.reject(new Error(message));
        // Strip HTML tags and check if there's actual text content
        const text = value.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
        if (!text) return Promise.reject(new Error(message));
        return Promise.resolve();
    },
});

const JobDescriptionSection = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faFileLines} className="text-orange-500" />
                About the Role
            </h3>

            <div>
                <Form.Item
                    name="about"
                    label={<span className="text-gray-500 uppercase text-xs font-bold tracking-wider">About the Role</span>}
                    className="mb-0"
                    required
                    rules={[richTextRequired('Please provide a description about the role')]}
                >
                    <SimpleTextEditor placeholder="Describe the role, responsibilities, and what you're looking for..." />
                </Form.Item>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <Form.Item
                    name="responsibilities"
                    label={<span className="text-gray-500 uppercase text-xs font-bold tracking-wider">Responsibilities</span>}
                    className="mb-0"
                    required
                    rules={[richTextRequired('Please provide the responsibilities')]}
                >
                    <SimpleTextEditor placeholder="List key duties..." showCount maxLength={5000} />
                </Form.Item>

                <Form.Item name="requirement" label={<span className="text-base font-semibold">Requirements</span>} className="mb-0" required>
                    <SimpleTextEditor placeholder="List qualifications..." showCount maxLength={5000} />
                </Form.Item>
            </div>
        </div>
    );
};

export default JobDescriptionSection;
