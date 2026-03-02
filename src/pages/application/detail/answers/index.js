import React from 'react';

const Answers = ({ answers }) => {
    if (!answers || answers.length === 0) return null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-5 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Candidate Answers</h3>
            </div>
            <div className="p-5 md:p-6 space-y-5">
                {answers.map((answer, index) => (
                    <div key={index} className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                            {index + 1}. {answer.question}
                        </h4>
                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200 leading-relaxed text-sm">
                            {answer.answer}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Answers;
