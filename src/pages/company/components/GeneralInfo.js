import React from 'react';
import Input from '@/components/Input';

const GeneralInfo = ({ formData, handleChange }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">General Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Company Name"
                    name="companyName"
                    value={formData.companyName || ''}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Website"
                    name="companyLink"
                    value={formData.companyLink || ''}
                    onChange={handleChange}
                    placeholder="https://..."
                />
                <div className="col-span-full">
                    <Input.TextArea
                        label="Description"
                        name="description"
                        value={formData.description || ''}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Introduce your company..."
                    />
                </div>
            </div>
        </div>
    );
};

export default GeneralInfo;
