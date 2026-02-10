import React from 'react';
import { Slider, Tag, Form, Switch } from 'antd';

const ScoringWeights = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-icons-round text-orange-500">psychology</span>
                    AI Scoring Weights
                </h3>
                <Form.Item name="enableAiScoring" valuePropName="checked" initialValue={true} noStyle>
                    <Switch checkedChildren="AI Active" unCheckedChildren="AI Off" className="bg-orange-500" />
                </Form.Item>
            </div>

            <div className="space-y-6">
                <div>
                    <div className="flex justify-between mb-1 text-sm">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Skills Match</span>
                        <span className="text-orange-500 font-medium">High Importance (40%)</span>
                    </div>
                    <Form.Item name="weight_1" initialValue={40} noStyle>
                        <Slider trackStyle={{ backgroundColor: '#F97316' }} handleStyle={{ borderColor: '#F97316', backgroundColor: '#F97316' }} />
                    </Form.Item>
                </div>
                <div>
                    <div className="flex justify-between mb-1 text-sm">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Experience Level</span>
                        <span className="text-orange-500 font-medium">Medium (30%)</span>
                    </div>
                    <Form.Item name="weight_2" initialValue={30} noStyle>
                        <Slider trackStyle={{ backgroundColor: '#F97316' }} handleStyle={{ borderColor: '#F97316', backgroundColor: '#F97316' }} />
                    </Form.Item>
                </div>
                <div>
                    <div className="flex justify-between mb-1 text-sm">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Education</span>
                        <span className="text-gray-500 font-medium">Low (30%)</span>
                    </div>
                    <Form.Item name="weight_3" initialValue={30} noStyle>
                        <Slider trackStyle={{ backgroundColor: '#F97316' }} handleStyle={{ borderColor: '#F97316', backgroundColor: '#F97316' }} />
                    </Form.Item>
                </div>
            </div>
        </div>
    );
};

export default ScoringWeights;
