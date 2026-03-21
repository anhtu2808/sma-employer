import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import SectionHeader from './SectionHeader';

const JOB_STATUS_CONFIG = [
  { key: 'PUBLISHED', label: 'Published', color: 'bg-green-500', textColor: 'text-green-600 dark:text-green-400', bgLight: 'bg-green-50 dark:bg-green-900/20' },
  { key: 'DRAFT', label: 'Draft', color: 'bg-gray-400', textColor: 'text-gray-600 dark:text-gray-400', bgLight: 'bg-gray-50 dark:bg-gray-800' },
  { key: 'PENDING_REVIEW', label: 'Pending Review', color: 'bg-yellow-500', textColor: 'text-yellow-600 dark:text-yellow-400', bgLight: 'bg-yellow-50 dark:bg-yellow-900/20' },
  { key: 'SUSPENDED', label: 'Suspended', color: 'bg-red-500', textColor: 'text-red-600 dark:text-red-400', bgLight: 'bg-red-50 dark:bg-red-900/20' },
  { key: 'CLOSED', label: 'Closed', color: 'bg-blue-400', textColor: 'text-blue-600 dark:text-blue-400', bgLight: 'bg-blue-50 dark:bg-blue-900/20' },
];

const JobPipelineItem = ({ label, count, total, color, textColor, bgLight }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${textColor}`}>{label}</span>
        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{count}</span>
      </div>
      <div className={`w-full h-2.5 rounded-full ${bgLight} overflow-hidden`}>
        <div
          className={`h-full rounded-full ${color} transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const JobPipeline = ({ isLoading, totalJobs, getCountByStatus }) => {
  const navigate = useNavigate();

  return (
    <div className="lg:col-span-2 bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
      <SectionHeader title="Job Pipeline" linkTo="/jobs" />
      {isLoading ? (
        <Loading className="py-8" />
      ) : totalJobs === 0 ? (
        <div className="text-center py-10">
          <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="material-icons-outlined text-gray-400 text-2xl">work_outline</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">No jobs created yet</p>
          <Button mode="primary" shape="rounded" size="sm" onClick={() => navigate('/jobs/create')}>
            Post your first job
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <span className="material-icons-outlined text-primary">summarize</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Jobs</span>
            <span className="ml-auto text-xl font-bold text-gray-900 dark:text-white">{totalJobs}</span>
          </div>
          {JOB_STATUS_CONFIG.map(({ key, label, color, textColor, bgLight }) => (
            <JobPipelineItem
              key={key}
              label={label}
              count={getCountByStatus(key)}
              total={totalJobs}
              color={color}
              textColor={textColor}
              bgLight={bgLight}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export { JOB_STATUS_CONFIG };
export default JobPipeline;
