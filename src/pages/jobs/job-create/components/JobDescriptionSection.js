import React from 'react';
import { Form, Input } from 'antd';
import TiptapEditor from '@/components/TiptapEditor';

const JobDescriptionSection = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-icons-round text-orange-500">description</span>
                About the Role
            </h3>

            <div>
                <Form.Item name="about" className="mb-0">
                    <TiptapEditor placeholder="Describe the role, responsibilities, and what you're looking for..." />
                </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item name="responsibilities" label="Responsibilities" className="mb-0">
                    <Input.TextArea placeholder="List key duties..." rows={5} className="rounded-lg" />
                </Form.Item>

                <Form.Item name="requirement" label="Requirements" className="mb-0">
                    <Input.TextArea placeholder="List key duties..." rows={5} className="rounded-lg" />
                </Form.Item>
            </div>
        </div>
    );
};

export default JobDescriptionSection;
