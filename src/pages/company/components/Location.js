import React, { useState } from 'react';
import Input from '@/components/Input';
import Form from '@/components/Form';
import { Select } from 'antd';

const Location = ({ form, isEditing }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const locationsWatch = Form.useWatch('locations', form) || [];

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">Location</h3>
            <Form.List name="locations" initialValue={[{}]}>
                {(fields, { add, remove }) => {
                    // Ensure activeIndex is valid
                    if (fields.length > 0 && activeIndex >= fields.length) {
                        setActiveIndex(fields.length - 1);
                    }

                    return (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Select
                                    className="flex-1"
                                    value={activeIndex}
                                    onChange={(val) => setActiveIndex(val)}
                                    options={fields.map((field, index) => ({
                                        value: index,
                                        label: locationsWatch[index]?.name || `Location ${index + 1}`
                                    }))}
                                    notFoundContent="No locations"
                                    disabled={false} // Override form disabled context so users can flip locations
                                />
                                {isEditing && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                add();
                                                setActiveIndex(fields.length);
                                            }}
                                            className="flex items-center justify-center py-1.5 px-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                        >
                                            <span className="material-icons-round mr-1 text-sm">add</span>
                                            Add
                                        </button>
                                        {fields.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    remove(activeIndex);
                                                    setActiveIndex(Math.max(0, activeIndex - 1));
                                                }}
                                                className="flex items-center justify-center py-1.5 px-3 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                                                title="Remove location"
                                            >
                                                <span className="material-icons-round mr-1 text-sm">delete_outline</span>
                                                Remove
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>

                            {fields.map(({ key, name, ...restField }, index) => (
                                <div
                                    key={key}
                                    className={`p-4 border border-gray-100 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800/50 ${index !== activeIndex ? 'hidden' : ''}`}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                        <Form.Item {...restField} name={[name, 'name']} label="Location Name">
                                            <Input placeholder="e.g. Headquarters" />
                                        </Form.Item>
                                        <div className="col-span-full">
                                            <Form.Item {...restField} name={[name, 'address']} label="Address">
                                                <Input placeholder="Street address" />
                                            </Form.Item>
                                        </div>
                                        <Form.Item {...restField} name={[name, 'district']} label="District">
                                            <Input />
                                        </Form.Item>
                                        <Form.Item {...restField} name={[name, 'city']} label="City">
                                            <Input />
                                        </Form.Item>
                                        <Form.Item {...restField} name={[name, 'country']} label="Country">
                                            <Input />
                                        </Form.Item>
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                }}
            </Form.List>
        </div>
    );
};

export default Location;
