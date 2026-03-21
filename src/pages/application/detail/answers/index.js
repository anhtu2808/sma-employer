import React from 'react';

const Answers = ({ answers }) => {
    if (!answers || answers.length === 0) return null;

    return (
        <div className="space-y-4">
            {answers.map((answer, index) => (
                <div key={index} className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                        {index + 1}. {answer.question}
                    </h4>
                    <div className="p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-xl border border-gray-100 dark:border-neutral-800 text-gray-700 dark:text-gray-200 leading-relaxed text-sm">
                        {answer.answer}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Answers;
