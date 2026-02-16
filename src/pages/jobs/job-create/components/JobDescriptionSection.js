import React from 'react';
import { Input, Form } from 'antd';

const JobDescriptionSection = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                About the Role
            </h3>

            <div>
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary">
                    <Form.Item name="about" noStyle>
                        <Input.TextArea
                            placeholder="Describe the role, responsibilities, and what you're looking for..."
                            rows={8}
                            className="border-none focus:shadow-none resize-none p-4"
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

export default JobDescriptionSection;
