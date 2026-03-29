import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faBriefcase, faClock, faUsers } from '../../../utils/icons';

const getDaysUntilExpiry = (expDate) => {
  const now = new Date();
  const exp = new Date(expDate);
  return Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
};

const ExpiryBadge = ({ daysLeft }) => {
  if (daysLeft < 0) return null;
  const colorClass = daysLeft < 3
    ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
    : daysLeft < 7
      ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
      : 'bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400';

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${colorClass}`}>
      <FontAwesomeIcon icon={faClock} className="text-xs" />
      {daysLeft === 0 ? 'Expires today' : `${daysLeft}d left`}
    </span>
  );
};

const CardSkeleton = () => (
  <div className="min-w-[280px] max-w-[320px] flex-shrink-0 p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-card-light dark:bg-card-dark">
    <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3" />
    <div className="flex gap-2 mb-4">
      <div className="w-16 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      <div className="w-14 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
    </div>
    <div className="flex gap-4 mb-3">
      <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
    </div>
    <div className="w-16 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
  </div>
);

const JobsAttention = ({ jobs, isLoading }) => {
  const navigate = useNavigate();

  const publishedJobs = useMemo(() => {
    if (!jobs) return [];
    return jobs
      .filter(job => job.status === 'PUBLISHED')
      .sort((a, b) => (b.newApplications || 0) - (a.newApplications || 0))
      .slice(0, 6);
  }, [jobs]);

  if (isLoading) {
    return (
      <div className="overflow-x-auto pb-2 -mx-1 px-1">
        <div className="flex gap-4">
          {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (publishedJobs.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
          <FontAwesomeIcon icon={faBriefcase} className="text-gray-400 text-2xl" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">No active jobs</p>
        <Link
          to="/jobs/create"
          className="text-sm text-primary hover:text-primary-hover font-medium inline-flex items-center gap-1"
        >
          Post your first job
          <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-2 -mx-1 px-1">
      <div className="flex gap-4">
        {publishedJobs.map(job => {
          const daysLeft = getDaysUntilExpiry(job.expDate);
          return (
            <div
              key={job.id}
              className="min-w-[280px] max-w-[320px] flex-shrink-0 p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-card-light dark:bg-card-dark hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group"
              onClick={() => navigate(`/jobs/${job.id}`)}
            >
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate mb-2 group-hover:text-primary transition-colors">
                {job.name}
              </h4>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                  Published
                </span>
                {job.workingModel && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    {job.workingModel}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                <span className="flex items-center gap-1">
                  <span className="font-bold text-sm text-gray-900 dark:text-white">{job.newApplications || 0}</span>
                  new
                </span>
                <span className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faUsers} className="text-sm" />
                  {job.totalApplications || 0} total
                </span>
              </div>
              {job.expDate && <ExpiryBadge daysLeft={daysLeft} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JobsAttention;
