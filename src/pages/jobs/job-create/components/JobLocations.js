import React from 'react';
import { Input, Tag, Form, Select } from 'antd';
import { useGetCompanyLocationQuery } from '@/apis/companyApi';

const JobLocations = () => {
    const { data: locations = [], isLoading } = useGetCompanyLocationQuery();

    const locationOptions = locations.map((location) => ({
        value: location.id,
        label: `${location.name} - ${location.address}, ${location.district}, ${location.city}, ${location.country}`,
    }));

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-icons-round text-orange-500">location_on</span>
                Locations
            </h3>

            <Form.Item name="locationIds" label="Locations" className="mb-0">
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
