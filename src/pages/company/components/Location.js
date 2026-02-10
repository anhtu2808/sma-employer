import React from 'react';
import Input from '@/components/Input';
import Form from '@/components/Form';

const Location = () => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full">
                    <Form.Item name="address" label="Address">
                        <Input placeholder="Street address" />
                    </Form.Item>
                </div>
                <Form.Item name="district" label="District">
                    <Input />
                </Form.Item>
                <Form.Item name="city" label="City">
                    <Input />
                </Form.Item>
                <Form.Item name="country" label="Country">
                    <Input />
                </Form.Item>
            </div>
        </div>
    );
};

export default Location;
