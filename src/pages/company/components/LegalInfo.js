import React from 'react';
import Input from '@/components/Input';
import Form from '@/components/Form';

const LegalInfo = () => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">Legal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item name="taxIdentificationNumber" label="Tax ID">
                    <Input disabled />
                </Form.Item>
                <Form.Item name="erc" label="ERC Document">
                    <Input disabled />
                </Form.Item>
            </div>
        </div>
    );
};

export default LegalInfo;
