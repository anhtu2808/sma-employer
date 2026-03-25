import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionHeader from './SectionHeader';

const getDaysUntilExpiry = (expDate) => {
  if (!expDate) return null;
  const now = new Date();
  const exp = new Date(expDate);
  return Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
};

const SORT_KEYS = {
  name: (a, b) => (a.name || '').localeCompare(b.name || ''),
  applications: (a, b) => (b.totalApplications || 0) - (a.totalApplications || 0),
  newApps: (a, b) => (b.newApplications || 0) - (a.newApplications || 0),
  expires: (a, b) => {
    const dA = getDaysUntilExpiry(a.expDate);
    const dB = getDaysUntilExpiry(b.expDate);
    if (dA === null && dB === null) return 0;
    if (dA === null) return 1;
    if (dB === null) return -1;
    return dA - dB;
  },
};

const TableSkeleton = () => (
  <div className="space-y-3 py-2">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="flex items-center gap-4 px-4 py-3">
        <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="w-16 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    ))}
  </div>
);

const SortableHeader = ({ label, sortKey, currentSort, onSort }) => {
  const isActive = currentSort.key === sortKey;
  return (
    <th
      className="px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 select-none"
      onClick={() => onSort(sortKey)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {isActive && (
          <span className="material-icons-outlined text-xs">
            {currentSort.asc ? 'arrow_upward' : 'arrow_downward'}
          </span>
        )}
      </span>
    </th>
  );
};

const JobPerformance = ({ jobs, isLoading }) => {
  const navigate = useNavigate();
  const [sort, setSort] = useState({ key: 'newApps', asc: false });

  const handleSort = (key) => {
    setSort(prev => ({
      key,
      asc: prev.key === key ? !prev.asc : false,
    }));
  };

  const publishedJobs = useMemo(() => {
    if (!jobs) return [];
    const filtered = jobs.filter(j => j.status === 'PUBLISHED');
    const sortFn = SORT_KEYS[sort.key] || SORT_KEYS.newApps;
    const sorted = [...filtered].sort(sortFn);
    return sort.asc ? sorted.reverse() : sorted;
  }, [jobs, sort]);

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="px-6 py-5">
        <SectionHeader title="Job Performance" linkTo="/jobs" />
      </div>
      {isLoading ? (
        <TableSkeleton />
      ) : publishedJobs.length === 0 ? (
        <div className="text-center py-10 px-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">No published jobs</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-y border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
              <tr>
                <SortableHeader label="Job Name" sortKey="name" currentSort={sort} onSort={handleSort} />
                <SortableHeader label="Applications" sortKey="applications" currentSort={sort} onSort={handleSort} />
                <SortableHeader label="New Apps" sortKey="newApps" currentSort={sort} onSort={handleSort} />
                <SortableHeader label="Expires In" sortKey="expires" currentSort={sort} onSort={handleSort} />
                <th className="px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {publishedJobs.map(job => {
                const daysLeft = getDaysUntilExpiry(job.expDate);
                const expiryColor = daysLeft !== null && daysLeft < 3
                  ? 'text-red-600 dark:text-red-400'
                  : daysLeft !== null && daysLeft < 7
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-gray-600 dark:text-gray-400';

                return (
                  <tr
                    key={job.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white truncate max-w-[240px]">
                      {job.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {job.totalApplications || 0}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-gray-900 dark:text-white">{job.newApplications || 0}</span>
                    </td>
                    <td className={`px-4 py-3 text-sm font-medium ${expiryColor}`}>
                      {daysLeft !== null ? (daysLeft <= 0 ? 'Expired' : `${daysLeft} days`) : '--'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                        Published
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default JobPerformance;
