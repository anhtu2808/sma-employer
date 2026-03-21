import React from 'react';

const CoverLetter = ({ coverLetter }) => {
    if (!coverLetter) return null;

    const isHtml = /<[a-z][\s\S]*>/i.test(coverLetter);

    if (isHtml) {
        return (
            <div
                className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm prose prose-sm dark:prose-invert max-w-none
                    [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-orange-500 [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: coverLetter }}
            />
        );
    }

    return (
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-sm">
            {coverLetter}
        </p>
    );
};

export default CoverLetter;
