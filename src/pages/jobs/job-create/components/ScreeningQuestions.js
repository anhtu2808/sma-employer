import React from 'react';
import { Form, Select } from 'antd';

const ScreeningQuestions = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-icons-round text-orange-500">quiz</span>
                    Screening Questions
                </h3>

            </div>

            <Form.Item name="questionIds" label="Select Questions" className="mb-0">
                <Select
                    mode="multiple"
                    placeholder="Select screening questions..."
                    className="w-full"
                    options={[
                        { value: 1, label: 'How many years of experience do you have with Figma?' },
                        { value: 2, label: 'Are you authorized to work in the US?' },
                        { value: 3, label: 'Do you have a Bachelor degree?' }
                    ]}
                />
            </Form.Item>

            <div className="space-y-3 mt-4">
                {/* Visual representations of selected questions could go here, but for now we rely on the Select */}
            </div>


        </div>
    );
};

export default ScreeningQuestions;
