import React from 'react';
import Input from '@/components/Input';
import Form from '@/components/Form';
import { Select } from 'antd';

const { Option } = Select;

const INDUSTRIES = [
    { value: 'INFORMATION_TECHNOLOGY', label: 'Information Technology' },
    { value: 'FINANCE', label: 'Finance' },
    { value: 'MARKETING', label: 'Marketing' },
    { value: 'CONSTRUCTION', label: 'Construction' },
    { value: 'EDUCATION', label: 'Education' },
    { value: 'HEALTHCARE', label: 'Healthcare' },
    { value: 'OTHER', label: 'Other' },
];

const COMPANY_TYPES = [
    { value: 'PRODUCT', label: 'Product' },
    { value: 'OUTSOURCING', label: 'Outsourcing' },
    { value: 'CONSULTING', label: 'Consulting' },
    { value: 'OTHER', label: 'Other' },
];

const Classification = () => {
    const selectStyle = {
        width: '100%',
        height: '42px',
        borderRadius: '8px',
        fontFamily: 'Interdisplay, Arial, sans-serif'
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">Classification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Form.Item name="companyIndustry" label="Industry">
                    <Select
                        placeholder="Select Industry"
                        style={selectStyle}
                    >
                        {INDUSTRIES.map(ind => (
                            <Option key={ind.value} value={ind.value}>{ind.label}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="companyType" label="Company Type">
                    <Select
                        placeholder="Select Type"
                        style={selectStyle}
                    >
                        {COMPANY_TYPES.map(type => (
                            <Option key={type.value} value={type.value}>{type.label}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="minSize" label="Min Size">
                    <Input type="number" />
                </Form.Item>
                <Form.Item name="maxSize" label="Max Size">
                    <Input type="number" />
                </Form.Item>
            </div>
        </div>
    );
};

export default Classification;
