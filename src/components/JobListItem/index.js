import React from 'react';
import PropTypes from 'prop-types';
import Button from '@/components/Button';

const JobListItem = ({
    title,
    status = 'Active',
    postedTime,
    location,
    salary,
    expiry,
    tags = [],
    stats = {},
    onViewDetails,
    className = ''
}) => {
    const isActive = status === 'Active';

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center hover:shadow-md transition-shadow ${className}`}>
            <div className="flex-1 space-y-3 w-full">
                <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white hover:text-primary cursor-pointer transition-colors" onClick={onViewDetails}>
                        {title}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${isActive
                        ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                        : 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600'
                        }`}>
                        {status}
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                    {location && (
                        <div className="flex items-center gap-1">
                            <span className="material-icons-round text-base">place</span>
                            <span>{location}</span>
                        </div>
                    )}
                    {salary && (
                        <div className="flex items-center gap-1">
                            <span className="material-icons-round text-base">payments</span>
                            <span>{salary}</span>
                        </div>
                    )}
                    {expiry && (
                        <div className="flex items-center gap-1">
                            <span className="material-icons-round text-base">event_busy</span>
                            <span className="text-orange-600 dark:text-orange-400">{expiry}</span>
                        </div>
                    )}
                </div>

                {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                        {tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 font-medium"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-6 pt-1">
                    {stats.applicants !== undefined && (
                        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <span className="material-icons-round text-green-600 text-lg">people_alt</span>
                            <span>{stats.applicants} applicants</span>
                        </div>
                    )}
                    {stats.views !== undefined && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                            <span className="material-icons-round text-lg">visibility</span>
                            <span>{stats.views} views</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto mt-2 md:mt-0">
                <Button
                    mode="secondary"
                    size="sm"
                    className="border-gray-300 dark:border-gray-600"
                    onClick={onViewDetails}
                >
                    View Details
                </Button>
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <span className="material-icons-round">more_horiz</span>
                </button>
            </div>
        </div>
    );
};

JobListItem.propTypes = {
    title: PropTypes.string.isRequired,
    status: PropTypes.string,
    postedTime: PropTypes.string,
    location: PropTypes.string,
    salary: PropTypes.string,
    expiry: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    stats: PropTypes.shape({
        applicants: PropTypes.number,
        views: PropTypes.number,
        ctr: PropTypes.number
    }),
    onViewDetails: PropTypes.func,
    className: PropTypes.string
};

export default JobListItem;
