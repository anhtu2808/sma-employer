import React from 'react';
import Input from '@/components/Input';

const Location = ({ formData, handleChange }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full">
                    <Input
                        label="Address"
                        name="address"
                        value={formData.address || ''}
                        onChange={handleChange}
                        placeholder="Street address"
                    />
                </div>
                <Input
                    label="District"
                    name="district"
                    value={formData.district || ''}
                    onChange={handleChange}
                />
                <Input
                    label="City"
                    name="city"
                    value={formData.city || ''}
                    onChange={handleChange}
                />
                <Input
                    label="Country"
                    name="country"
                    value={formData.country || ''}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
};

export default Location;
