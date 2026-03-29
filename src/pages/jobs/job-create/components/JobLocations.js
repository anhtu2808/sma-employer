import React from 'react';
import { Input, Tag, Form, Select } from 'antd';
import { useGetCompanyLocationQuery } from '@/apis/companyApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '../../../../utils/icons';

const JobLocations = () => {
    const { data: locations = [], isLoading } = useGetCompanyLocationQuery();

    const locationOptions = locations.map((location) => {
        const parts = [location.address, location.district, location.city, location.country].filter(Boolean);
        const label = location.name
            ? `${location.name} - ${parts.join(', ')}`
            : parts.join(', ');
        return { value: location.id, label: label || 'Unnamed location' };
    });

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faLocationDot} className="text-orange-500" />
                Locations
            </h3>

            <Form.Item name="locationIds" label="Locations" className="mb-0"
                rules={[{ required: true, message: 'At least one location is required' }]}>
                <Select
                    mode="multiple"
                    placeholder="Select locations..."
                    className="w-full"
                    options={locationOptions}
                />
            </Form.Item>
        </div>
    );
};

export default JobLocations;
