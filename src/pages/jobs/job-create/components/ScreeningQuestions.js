import React from 'react';
import { Button } from 'antd';

const ScreeningQuestions = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-icons-round text-orange-500">quiz</span>
                    Screening Questions
                </h3>
                <button className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1">
                    <span className="material-icons-round text-sm">add</span> Add New
                </button>
            </div>

            <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg flex justify-between items-start">
                    <div className="flex gap-3">
                        <span className="material-icons-round text-orange-500 mt-0.5">check_circle</span>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">How many years of experience do you have with Figma?</p>
                            <p className="text-xs text-gray-500">Type: Numeric Input</p>
                        </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600"><span className="material-icons-round">drag_indicator</span></button>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg flex justify-between items-start">
                    <div className="flex gap-3">
                        <span className="material-icons-round text-orange-500 mt-0.5">check_circle</span>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">Are you authorized to work in the US?</p>
                            <p className="text-xs text-gray-500">Type: Yes/No</p>
                        </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600"><span className="material-icons-round">drag_indicator</span></button>
                </div>
            </div>

            <Button block type="dashed" className="border-gray-300 text-gray-500 hover:text-orange-500 hover:border-orange-500">
                Select from library
            </Button>
        </div>
    );
};

export default ScreeningQuestions;
