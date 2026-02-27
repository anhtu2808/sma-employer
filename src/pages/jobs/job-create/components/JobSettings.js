import React from 'react';
import { DatePicker, InputNumber, Slider, Form } from 'antd';

const JobSettings = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-icons-round text-orange-500">tune</span>
                Job Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item name="expDate" label="Application Deadline" className="mb-0">
                    <DatePicker className="w-full rounded-lg py-2" format="MM/DD/YYYY" placeholder="mm/dd/yyyy" />
                </Form.Item>

                <Form.Item name="quantity" label="Number of Openings" className="mb-0">
                    <InputNumber className="w-full rounded-lg py-1.5" min={1} />
                </Form.Item>
            </div>

            <div>
                <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Auto-Reject Threshold
                    </label>
                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.autoRejectThreshold !== currentValues.autoRejectThreshold}
                    >
                        {({ getFieldValue }) => {
                            const threshold = getFieldValue('autoRejectThreshold') ?? 40;
                            return (
                                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                                    Below {threshold}%
                                </span>
                            );
                        }}
                    </Form.Item>
                </div>
                <Form.Item name="autoRejectThreshold" noStyle initialValue={40}>
                    <Slider trackStyle={{ backgroundColor: '#F97316' }} handleStyle={{ borderColor: '#F97316', backgroundColor: '#F97316' }} />
                </Form.Item>
                <p className="text-xs text-gray-500 mt-1">Candidates scoring below this will be automatically moved to 'Rejected'.</p>
            </div>
        </div>
    );
};

export default JobSettings;
