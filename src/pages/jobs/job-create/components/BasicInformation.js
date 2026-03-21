import React from 'react';
import { Input, Form } from 'antd';
import SimpleTextEditor from '@/components/SimpleTextEditor';

const BasicInformation = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-icons-round text-orange-500">article</span>
                Basic Information
            </h3>

            <Form.Item
                name="name"
                label="Job Title"
                rules={[{ required: true, message: 'Please enter job title' }]}
            >
                <Input placeholder="e.g. Senior Product Designer" className="rounded-lg py-2" />
            </Form.Item>

            <Form.Item name="about" label="About the Job">
                <SimpleTextEditor placeholder="Describe the role overview..." showCount maxLength={5000} />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item name="responsibilities" label="Responsibilities" className="mb-0">
                    <SimpleTextEditor placeholder="List key duties..." showCount maxLength={5000} />
                </Form.Item>

                <Form.Item name="requirement" label="Requirements" className="mb-0">
                    <SimpleTextEditor placeholder="List qualifications..." showCount maxLength={5000} />
                </Form.Item>
            </div>
        </div>
    );
};

export default BasicInformation;
