import React from 'react';
import Input from '@/components/Input';

const ContactInfo = ({ formData, handleChange }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Email"
                    name="companyEmail"
                    type="email"
                    value={formData.companyEmail || ''}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
};

export default ContactInfo;
