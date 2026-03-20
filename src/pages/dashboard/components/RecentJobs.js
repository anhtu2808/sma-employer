import React from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '@/components/Loading';
import SectionHeader from './SectionHeader';
import { JOB_STATUS_CONFIG } from './JobPipeline';

const RecentJobs = ({ isLoading, recentJobs }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-8">
      <SectionHeader title="Recent Jobs" linkTo="/jobs" />
      {isLoading ? (
        <Loading className="py-6" />
      ) : recentJobs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">No jobs yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentJobs.map(job => {
            const statusCfg = JOB_STATUS_CONFIG.find(s => s.key === job.status) || JOB_STATUS_CONFIG[0];
            return (
              <div
                key={job.id}
                className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group"
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate flex-1 mr-2 group-hover:text-primary transition-colors">
                    {job.name}
                  </h4>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${statusCfg.bgLight} ${statusCfg.textColor} whitespace-nowrap`}>
                    {statusCfg.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  {job.applicantsCount != null && (
                    <span className="flex items-center gap-1">
                      <span className="material-icons-outlined text-sm">people</span>
                      {job.applicantsCount}
                    </span>
                  )}
                  {job.viewsCount != null && (
                    <span className="flex items-center gap-1">
                      <span className="material-icons-outlined text-sm">visibility</span>
                      {job.viewsCount}
                    </span>
                  )}
                  {job.workingModel && (
                    <span className="flex items-center gap-1">
                      <span className="material-icons-outlined text-sm">location_on</span>
                      {job.workingModel}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentJobs;
