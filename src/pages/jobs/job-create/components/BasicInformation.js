import React from 'react';
import { Input, Form } from 'antd';

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

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    About the Job
                </label>
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                    {/* Toolbar Placeholder */}
                    <div className="bg-gray-50 dark:bg-gray-900 p-2 border-b border-gray-300 dark:border-gray-600 flex gap-2">
                        <button type="button" className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><span className="material-icons-round text-sm">format_bold</span></button>
                        <button type="button" className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><span className="material-icons-round text-sm">format_italic</span></button>
                        <button type="button" className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><span className="material-icons-round text-sm">format_list_bulleted</span></button>
                        <button type="button" className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><span className="material-icons-round text-sm">link</span></button>
                    </div>
                    <Form.Item name="about" noStyle>
                        <Input.TextArea
                            placeholder="Describe the role overview..."
                            rows={6}
                            className="border-none focus:shadow-none resize-none pt-3"
                            bordered={false}
                        />
                    </Form.Item>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item name="responsibilities" label="Responsibilities" className="mb-0">
                    <Input.TextArea placeholder="List key duties..." rows={5} className="rounded-lg" />
                </Form.Item>

                <Form.Item name="requirement" label="Requirements" className="mb-0">
                    <Input.TextArea placeholder="List qualifications..." rows={5} className="rounded-lg" />
                </Form.Item>
            </div>
        </div>
    );
};

export default BasicInformation;
