import React from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/Loading';
import SectionHeader from './SectionHeader';

const STATUS_STYLES = {
  APPLIED: { bg: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-700 dark:text-cyan-300' },
  VIEWED: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-700 dark:text-indigo-300' },
  SHORTLISTED: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-300' },
  REJECTED: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-300' },
  APPROVED: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-300' },
};

const StatusBadge = ({ status }) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES.APPLIED;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
      {status}
    </span>
  );
};

const RecentApplications = ({ isLoading, applications }) => {
  const navigate = useNavigate();

  return (
    <div className="lg:col-span-2 bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="px-6 py-5">
        <SectionHeader title="Recent Applications" linkTo="/applications" />
      </div>
      {isLoading ? (
        <Loading className="py-8" />
      ) : applications.length === 0 ? (
        <div className="text-center py-10 px-6">
          <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="material-icons-outlined text-gray-400 text-2xl">person_search</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">No applications received yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-y border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wider">Candidate</th>
                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wider">Job</th>
                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wider">Status</th>
                <th className="px-6 py-3 font-semibold text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wider">Applied</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer" onClick={() => navigate('/applications')}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {(app.candidateName || app.candidate?.fullName || 'U').charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white truncate max-w-[160px]">
                        {app.candidateName || app.candidate?.fullName || 'Unknown'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400 truncate max-w-[180px]">
                    {app.jobName || app.job?.name || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">
                    {app.appliedAt || app.createdAt ? new Date(app.appliedAt || app.createdAt).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentApplications;
