import React from 'react';
import Button from '@/components/Button';

const Overview = ({ cvData }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 md:p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="material-icons-outlined text-orange-500 text-lg">auto_awesome</span>
                        <span className="text-sm font-semibold text-orange-500 uppercase tracking-wider">
                            Proposed Candidate
                        </span>
                    </div>

                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                        {cvData.resumeName || cvData.fileName || 'Unknown Candidate'}
                    </h1>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1.5">
                            <span className="material-icons-round text-sm">mail</span>
                            {cvData.emailInResume}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="material-icons-round text-sm">phone</span>
                            {cvData.phoneInResume}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
                    {cvData.resumeUrl && (
                        <Button
                            mode="ghost"
                            size="md"
                            shape="round"
                            onClick={() => window.open(cvData.resumeUrl, '_blank')}
                        >
                            Open CV Original
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Overview;
