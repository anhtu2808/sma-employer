import React from 'react';
import Input from '@/components/Input';
import Form from '@/components/Form';
import { Image } from 'antd';

const LegalInfo = ({ isEditing }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">Legal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item name="taxIdentificationNumber" label="Tax ID">
                    <Input disabled />
                </Form.Item>
                {isEditing ? (
                    <Form.Item name="erc" label="ERC Document">
                        <Input disabled />
                    </Form.Item>
                ) : (
                    <Form.Item name="erc" label="ERC Document">
                        <ErcPreview />
                    </Form.Item>
                )}
            </div>
        </div>
    );
};

const ErcPreview = ({ value }) => {
    if (!value) {
        return <span className="text-gray-400 text-sm">No document</span>;
    }
    return (
        <Image
            src={value}
            width={80}
            height={80}
            className="rounded-lg object-cover"
            style={{ borderRadius: 8, objectFit: 'cover' }}
            preview={{ mask: <span className="text-xs">Click to preview</span> }}
        />
    );
};

export default LegalInfo;
