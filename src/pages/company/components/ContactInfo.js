import React from 'react';
import Input from '@/components/Input';
import Form from '@/components/Form';

const ContactInfo = () => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item
                    name="companyEmail"
                    label="Email"
                    rules={[{ required: true, message: 'Please enter email' }, { type: 'email', message: 'Invalid email' }]}
                >
                    <Input type="email" />
                </Form.Item>
                <Form.Item name="phone" label="Phone">
                    <Input />
                </Form.Item>
            </div>
        </div>
    );
};

export default ContactInfo;
