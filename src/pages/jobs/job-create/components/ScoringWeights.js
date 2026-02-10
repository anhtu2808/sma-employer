import React from 'react';
import { Slider, Tag } from 'antd';

const ScoringWeights = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-icons-round text-orange-500">psychology</span>
                    AI Scoring Weights
                </h3>
                <Tag color="orange" className="bg-orange-100 text-orange-600 border-none m-0 rounded-full px-2">● AI Active</Tag>
            </div>

            <div className="space-y-6">
                <div>
                    <div className="flex justify-between mb-1 text-sm">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Skills Match</span>
                        <span className="text-orange-500 font-medium">High Importance (80%)</span>
                    </div>
                    <Slider defaultValue={80} trackStyle={{ backgroundColor: '#F97316' }} handleStyle={{ borderColor: '#F97316', backgroundColor: '#F97316' }} />
                </div>
                <div>
                    <div className="flex justify-between mb-1 text-sm">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Experience Level</span>
                        <span className="text-orange-500 font-medium">Medium (50%)</span>
                    </div>
                    <Slider defaultValue={50} trackStyle={{ backgroundColor: '#F97316' }} handleStyle={{ borderColor: '#F97316', backgroundColor: '#F97316' }} />
                </div>
                <div>
                    <div className="flex justify-between mb-1 text-sm">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Education</span>
                        <span className="text-gray-500 font-medium">Low (20%)</span>
                    </div>
                    <Slider defaultValue={20} trackStyle={{ backgroundColor: '#F97316' }} handleStyle={{ borderColor: '#F97316', backgroundColor: '#F97316' }} />
                </div>
            </div>
        </div>
    );
};

export default ScoringWeights;
