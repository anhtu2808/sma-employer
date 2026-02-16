import React from 'react';

const ProTips = () => {
    return (
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">Pro Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 list-disc pl-4">
                <li>Use a clear, standard job title.</li>
                <li>Be specific about requirements.</li>
                <li>Include salary range to attract 3x more candidates.</li>
            </ul>
        </div>
    );
};

export default ProTips;
