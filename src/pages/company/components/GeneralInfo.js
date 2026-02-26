import React from 'react';
import Input from '@/components/Input';
import Form from '@/components/Form';

const GeneralInfo = () => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">General Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item
                    name="name"
                    label="Company Name"
                    rules={[{ required: true, message: 'Please enter company name' }]}
                >
                    <Input placeholder="Enter company name" />
                </Form.Item>
                <Form.Item
                    name="link"
                    label="Website"
                    rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
                >
                    <Input placeholder="https://..." />
                </Form.Item>
                <div className="col-span-full">
                    <Form.Item
                        name="description"
                        label="Description"
                    >
                        <Input.TextArea
                            rows={4}
                            placeholder="Introduce your company..."
                        />
                    </Form.Item>
                </div>
            </div>
        </div>
    );
};

export default GeneralInfo;
