import React from 'react';
import { Input, Form } from 'antd';

const JobIdentity = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-start gap-4">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center shrink-0">
                <span className="material-icons-round text-gray-400 text-4xl">business</span>
            </div>
            <div className="flex-1">
                <Form.Item
                    name="name"
                    label={<span className="text-gray-500 uppercase text-xs font-bold tracking-wider">Job Title</span>}
                    rules={[{ required: true, message: 'Please enter job title' }]}
                    className="mb-1"
                >
                    <Input
                        placeholder="e.g. Senior React Developer"
                        className="text-lg font-bold border border-gray-300 rounded-lg px-3 py-2 focus:shadow-none focus:border-primary hover:border-gray-400"
                    />
                </Form.Item>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <span className="material-icons-round text-base">domain</span>
                    <span>My Company (Smart Recruit)</span>
                </div>
            </div>
        </div>
    );
};

export default JobIdentity;
