import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

const ChipSkeleton = () => (
  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card-light dark:bg-card-dark border border-gray-100 dark:border-gray-800">
    <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
    <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
  </div>
);

const Chip = ({ to, dotColor, count, label, icon }) => (
  <Link
    to={to}
    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card-light dark:bg-card-dark border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-sm font-medium text-gray-700 dark:text-gray-300"
  >
    <span className={`w-2 h-2 rounded-full ${dotColor}`} />
    <span className="material-icons-outlined text-base">{icon}</span>
    <span className="font-bold text-gray-900 dark:text-white">{count}</span>
    <span>{label}</span>
  </Link>
);

const ActionChips = ({ statusSummary, jobs, isLoading }) => {
  const counts = useMemo(() => {
    const appliedCount = statusSummary?.statuses?.find(s => s.status === 'APPLIED')?.count || 0;
    const viewedCount = statusSummary?.statuses?.find(s => s.status === 'VIEWED')?.count || 0;

    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const expiringSoonCount = (jobs || []).filter(job => {
      if (job.status !== 'PUBLISHED') return false;
      const expDate = new Date(job.expDate);
      return expDate <= sevenDaysFromNow && expDate > now;
    }).length;

    return { appliedCount, viewedCount, expiringSoonCount };
  }, [statusSummary, jobs]);

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-3">
        <ChipSkeleton />
        <ChipSkeleton />
        <ChipSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Chip
        to="/applications?status=APPLIED"
        dotColor="bg-blue-500"
        icon="mail"
        count={counts.appliedCount}
        label="New Applications"
      />
      <Chip
        to="/applications?status=VIEWED"
        dotColor="bg-indigo-500"
        icon="visibility"
        count={counts.viewedCount}
        label="Awaiting Review"
      />
      <Chip
        to="/jobs?expiring=true"
        dotColor="bg-amber-500"
        icon="schedule"
        count={counts.expiringSoonCount}
        label="Expiring Soon"
      />
    </div>
  );
};

export default ActionChips;
