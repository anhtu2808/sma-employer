import React from 'react';
import Input from '@/components/Input';
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

const Classification = ({ formData, handleChange, handleSelectChange }) => {
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
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">Industry</label>
                    <Select
                        placeholder="Select Industry"
                        value={formData.companyIndustry}
                        onChange={(val) => handleSelectChange('companyIndustry', val)}
                        style={selectStyle}
                    >
                        {INDUSTRIES.map(ind => (
                            <Option key={ind.value} value={ind.value}>{ind.label}</Option>
                        ))}
                    </Select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">Company Type</label>
                    <Select
                        placeholder="Select Type"
                        value={formData.companyType}
                        onChange={(val) => handleSelectChange('companyType', val)}
                        style={selectStyle}
                    >
                        {COMPANY_TYPES.map(type => (
                            <Option key={type.value} value={type.value}>{type.label}</Option>
                        ))}
                    </Select>
                </div>
                <Input
                    label="Min Size"
                    name="minSize"
                    type="number"
                    value={formData.minSize || ''}
                    onChange={handleChange}
                />
                <Input
                    label="Max Size"
                    name="maxSize"
                    type="number"
                    value={formData.maxSize || ''}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
};

export default Classification;
